import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../roles.model';

export class CreateRoleDto {
  @ApiProperty({ example: RoleType.ADMIN, description: 'Role name' })
  readonly name: string;
}
