import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { RoleType } from '../roles.model';

export class GetRoleByNameDto {
  @ApiProperty({ example: RoleType.ADMIN, description: 'Role name' })
  @IsNotEmpty({ message: 'Не должна быть пустой' })
  @IsString({ message: 'Должна быть строкой' })
  readonly name: string;
}
