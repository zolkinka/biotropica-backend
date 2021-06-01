import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RoleType } from 'src/roles/roles.model';

export class AddRoleDto {
  @ApiProperty({ example: RoleType.ADMIN, description: 'Role name' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly name: string;
  @ApiProperty({
    example: 5,
    description: 'The id of the user to add the role to',
  })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  readonly userId: number;
}
