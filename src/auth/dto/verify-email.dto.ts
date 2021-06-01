import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'success', description: 'Is the user verified' })
  success: boolean;
  @ApiProperty({
    example:
      'Почта успешно подтверждена, теперь вы можете купить тарифный план',
    description: 'Message success',
  })
  message: string;
}
