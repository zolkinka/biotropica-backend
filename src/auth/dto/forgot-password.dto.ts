import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
}
