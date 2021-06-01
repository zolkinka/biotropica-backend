import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Email, EmailOptions } from 'src/utils/Email';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: SigninUserDto) {
    const user = await this.validateUser(dto);
    this.checkUserConfirmation(user);
    return await this.generateToken(user);
  }

  async signup(dto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(dto.email);

    this.checkCandidateForUnique(candidate);
    this.checkPasswordsMatch(dto.password, dto.verification_password);

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const confirmedHash = await bcrypt.hash(
      process.env.SECRET_KEY || 'SECRET',
      5,
    );

    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
      confirmed_hash: confirmedHash,
    });

    await this.sendEmail(
      this.getConfirmationEmailOptions(user.email, confirmedHash),
      this.emailCallback,
    );

    return {
      success: true,
      message: 'Success registration',
    };
  }

  async verifyByEmail(confirmedHash: string, res: Response) {
    const user = await this.usersService.getUserByConfirmedHash(confirmedHash);

    //TODO: Redirect for authorization page
    if (user.confirmed) {
      return res.status(302).redirect('http://127.0.0.1:5500/signin.html');
    }
    user.confirmed = true;
    await user.save();
    return res.status(302).redirect('http://127.0.0.1:5500/signin.html');
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    this.checkUserExists(user);
    this.checkUserConfirmation(user);
    const { token } = await this.generateToken(user);
    await this.sendEmail(
      this.getForgotPasswordEmailOptions(user.email, token),
      this.emailCallback,
    );
    return {
      success: true,
      message: 'Письмо для восстановления пароля успешно отправлено',
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    this.checkPasswordsMatch(dto.password, dto.verification_password);
    const hashPassword = await bcrypt.hash(dto.password, 5);
    await this.usersService.updateUser(userId, {
      password: hashPassword,
    });

    return {
      success: true,
      message: 'Пароль успешно изменен',
    };
  }

  async restorePassword(token: string, res: Response) {
    return res
      .status(302)
      .redirect(`http://127.0.0.1:5500/changePassword.html?token=${token}`);
  }

  private async sendEmail(
    options: EmailOptions,
    callback: (err: any, success: any) => void,
  ) {
    const email = new Email();
    email.sendMail(options, callback);
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: SigninUserDto) {
    try {
      const user = await this.usersService.getUserByEmail(dto.email);
      const equalPassword = await bcrypt.compare(dto.password, user.password);
      if (user && equalPassword) {
        return user;
      }
      this.throwErrorIncorrectEmailOrPassword();
    } catch (error) {
      this.throwErrorIncorrectEmailOrPassword();
    }
  }

  private throwErrorIncorrectEmailOrPassword() {
    throw new HttpException(
      'Некорректный email или пароль',
      HttpStatus.BAD_REQUEST,
    );
  }

  private checkPasswordsMatch(password: string, verificationPassword: string) {
    if (verificationPassword !== password) {
      throw new HttpException('Пароли не совпадают', HttpStatus.BAD_REQUEST);
    }
  }

  private checkCandidateForUnique(candidate: User) {
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkUserConfirmation(user: User) {
    if (!user.confirmed) {
      throw new HttpException(
        'Email адрес не подтвержден, подтвердите его, перейдя по ссылке в электронном письме.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkUserExists(user: User) {
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  }

  private getConfirmationEmailOptions(email: string, confirmedHash: string) {
    return {
      from: 'biotropica@gmail.com',
      to: email,
      subject: 'Подтверждение почты Biotropica',
      text: '',
      html: `Для подтверждения почты перейдите по ссылке: <a target="_blank" href="http://localhost:${
        process.env.PORT || 5000
      }/auth/verify?confirmedHash=${confirmedHash}">Подтвердить почту и войти</a>`,
    };
  }

  private getForgotPasswordEmailOptions(email: string, confirmedHash: string) {
    return {
      from: 'biotropica@gmail.com',
      to: email,
      subject: 'Восстановление пароля Biotropica',
      text: '',
      html: `Для восстановления пароля перейдите по ссылке: <a target="_blank" href="http://localhost:${
        process.env.PORT || 5000
      }/auth/restorePassword?token=${confirmedHash}">Создать новый пароль</a>`,
    };
  }

  private emailCallback(err: any, success: any) {
    if (err) {
      throw err;
    }
    console.log(success);
  }
}
