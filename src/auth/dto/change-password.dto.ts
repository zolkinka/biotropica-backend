import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from 'src/constants/password-length';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password123', description: 'User password' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} и не более ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly password: string;

  @ApiProperty({
    example: 'password123',
    description: 'User verification password',
  })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} и не более ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly verification_password: string;
}
