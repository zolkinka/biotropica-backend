import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { UserRoles } from './user-roles.model';

export interface RolesCreationsAttrs {
  name: string;
}

export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RolesCreationsAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({
    example: RoleType.ADMIN,
    description: 'Role name',
    default: RoleType.USER,
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    defaultValue: RoleType.USER,
  })
  name: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
