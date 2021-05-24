import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: CreateUserDto, response: Response) {
    const user = await this.validateUser(dto);
    const token = await this.generateToken(user);
    this.setBearerTokenInResponseCookie(token, response);
    return user;
  }

  async signup(dto: CreateUserDto, response: Response) {
    const candidate = await this.usersService.getUserByEmail(dto.email);

    if (candidate) {
      throw new HttpException(
        'User with this email exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);

    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    });

    const token = await this.generateToken(user);
    this.setBearerTokenInResponseCookie(token, response);
    return user;
  }

  private async generateToken(user: User) {
    const payload = {
      email: user.email,
      password: user.password,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
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

  private setBearerTokenInResponseCookie(token: string, response: Response) {
    response.cookie('Bearer', token, {
      httpOnly: true,
      expires: new Date(new Date().setMilliseconds(1 * 60 * 1000)),
    });
  }
}
