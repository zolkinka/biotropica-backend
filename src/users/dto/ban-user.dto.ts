import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    example: 5,
    description: 'Id of the user who needs to be banned',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  readonly userId: number;

  @ApiProperty({
    example: true,
    description: 'Ban/not ban',
  })
  @IsBoolean({ message: 'Должно быть булевским типом' })
  readonly banned: boolean;

  @ApiProperty({
    example: 'For obscene language',
    description: 'what to ban user?',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly banReason: string;
}
