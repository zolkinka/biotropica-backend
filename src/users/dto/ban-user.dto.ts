import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {
  @ApiProperty({
    example: 5,
    description: 'Id of the user who needs to be banned',
  })
  readonly userId: number;
  @ApiProperty({
    example: true,
    description: 'Ban/not ban',
  })
  readonly banned: boolean;
  @ApiProperty({
    example: 'For obscene language',
    description: 'what to ban user?',
  })
  readonly banReason: string;
}
