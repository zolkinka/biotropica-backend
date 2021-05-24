import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from 'src/roles/roles.model';

export class AddRoleDto {
  @ApiProperty({ example: RoleType.ADMIN, description: 'Role name' })
  readonly name: string;
  @ApiProperty({
    example: 5,
    description: 'The id of the user to add the role to',
  })
  readonly userId: number;
}
