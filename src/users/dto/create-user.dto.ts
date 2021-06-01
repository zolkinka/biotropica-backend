import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from 'src/constants/password-length';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: 'Niko', description: 'User name' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({ example: 'Bellik', description: 'User lastname' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly lastname: string;

  @ApiProperty({
    example: '8 (981) 228-14-88',
    description: 'User phone number',
  })
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(11, 11, {
    message: 'Номер должен быть 11 символов',
  })
  readonly phone: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} и не более ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly password: string;

  @ApiProperty({
    example: 'password123',
    description: 'User verification password',
  })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: `Пароль должен быть не менее ${MIN_PASSWORD_LENGTH} и не более ${MAX_PASSWORD_LENGTH} символов`,
  })
  readonly verification_password: string;

  @ApiProperty({
    example: 'secret_key+salt',
    description: 'Confirmation hash email',
  })
  readonly confirmed_hash: string;
}
