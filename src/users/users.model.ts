import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

export interface UserCreationsAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationsAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({ example: 'url_photo', description: 'Profile photo link' })
  @Column({
    type: DataType.STRING,
  })
  profile_photo: string;

  @ApiProperty({ example: 'Niko', description: 'User name' })
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ApiProperty({ example: 'Bellic', description: 'User lastname' })
  @Column({
    type: DataType.STRING,
  })
  lastname: string;

  @ApiProperty({ example: 'Bellicovich', description: 'User patronymic' })
  @Column({
    type: DataType.STRING,
  })
  patronymic: string;

  @ApiProperty({ example: '04.07.2001', description: 'User date of Birth' })
  @Column({
    type: DataType.STRING,
  })
  dob: string;

  @ApiProperty({
    example: '8 (981) 228-14-88',
    description: 'User phone number',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    example: 'male',
    description: 'User gender male or female',
  })
  @Column({
    type: DataType.STRING,
  })
  gender: string;

  @ApiProperty({
    example: '{"1": "url"}',
    description: 'Before photos',
  })
  @Column({
    type: DataType.JSON,
  })
  before_photos: JSON;

  @ApiProperty({
    example: '{"1": "url"}',
    description: 'After photos',
  })
  @Column({
    type: DataType.JSON,
  })
  after_photos: JSON;

  @ApiProperty({
    example: false,
    description: 'Is the plan paid',
    default: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  paid: boolean;

  @ApiProperty({
    example: true,
    description: 'Is the user banned',
  })
  @Column({
    type: DataType.BOOLEAN,
  })
  banned: boolean;

  @ApiProperty({
    example: 'Obscene language',
    description: 'What is banned for',
  })
  @Column({
    type: DataType.STRING,
  })
  banReason: string;

  @ApiProperty({
    example: true,
    description: 'Has the user confirmed his email?',
  })
  @Column({
    type: DataType.BOOLEAN,
  })
  confirmed: boolean;

  @ApiProperty({
    example: '1234fsadf345fbsdfg',
    description: 'Confirmation hash email',
  })
  @Column({
    type: DataType.STRING,
  })
  confirmed_hash: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
