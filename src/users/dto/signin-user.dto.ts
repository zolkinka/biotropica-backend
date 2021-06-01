import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from 'src/constants/password-length';

export class SigninUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} и не более ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly password: string;
}
