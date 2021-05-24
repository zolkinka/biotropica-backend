import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  readonly email: string;
  @ApiProperty({
    example: '8 (981) 228-14-88',
    description: 'User phone number',
  })
  readonly phone: string;
  @ApiProperty({ example: 'password123', description: 'User password' })
  readonly password: string;
}
