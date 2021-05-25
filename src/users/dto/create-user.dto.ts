import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  readonly email: string;
  @ApiProperty({ example: 'Niko', description: 'User name' })
  readonly name: string;
  @ApiProperty({ example: 'Bellik', description: 'User lastname' })
  readonly lastname: string;
  @ApiProperty({
    example: '8 (981) 228-14-88',
    description: 'User phone number',
  })
  readonly phone: string;
  @ApiProperty({ example: 'password123', description: 'User password' })
  readonly password: string;
  @ApiProperty({
    example: 'password123',
    description: 'User verification password',
  })
  readonly verification_password: string;
  @ApiProperty({
    example: 'secret_key+salt',
    description: 'Confirmation hash email',
  })
  readonly confirmed_hash: string;
}
