import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Email, EmailOptions } from 'src/utils/Email';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    await this.checkUserConfirmation(user);
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

    const options: EmailOptions = this.getConfirmationEmailOptions(
      user.email,
      confirmedHash,
    );

    this.sendConfirmationEmail(options, this.sendEmailCallback);

    return {
      success: true,
      message: 'Success registration',
    };
  }

  async verifyByEmail(confirmedHash: string, res: Response) {
    const user = await this.usersService.getUserByConfirmedHash(confirmedHash);

    //TODO: Redirect for authorization page
    if (user.confirmed) return res.status(302).redirect('/auth/signin');

    user.confirmed = true;
    await user.save();
    return {
      success: true,
      message:
        'Почта успешно подтверждена, теперь вы можете купить тарифный план',
    };
  }

  private async checkUserConfirmation(user: User) {
    if (!user.confirmed) {
      throw new HttpException(
        'Email address not confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendConfirmationEmail(
    options: EmailOptions,
    callback: (err: any, success: any) => void,
  ) {
    const email = new Email();
    email.sendMail(options, callback);
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      password: user.password,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    const equalPassword = await bcrypt.compare(dto.password, user.password);
    if (user && equalPassword) {
      return user;
    }
    throw new HttpException(
      'Incorrect email or password',
      HttpStatus.BAD_REQUEST,
    );
  }

  private checkPasswordsMatch(password: string, verificationPassword: string) {
    if (verificationPassword !== password) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST);
    }
  }

  private checkCandidateForUnique(candidate: User) {
    if (candidate) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getConfirmationEmailOptions(email: string, confirmedHash: string) {
    return {
      from: 'biotropica@gmail.com',
      to: email,
      subject: 'Подтверждение почты biotropica',
      text: '',
      html: `Для подтверждения почты перейдите по ссылке: <a target="_blank" href="http://localhost:${
        process.env.PORT || 5000
      }/auth/verify?confirmedHash=${confirmedHash}">Подтвердить почту и войти</a>`,
    };
  }

  private sendEmailCallback(err: any, success: any) {
    if (err) {
      throw err;
    }
    console.log(success);
  }
}
