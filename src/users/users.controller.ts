import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleType } from 'src/roles/roles.model';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users (Available only to the admin)' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  @Roles(RoleType.ADMIN, RoleType.DOCTOR)
  @UseGuards(RolesGuard)
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create user (Available only to the admin)' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @ApiBody({ type: AddRoleDto })
  @ApiOperation({
    summary: 'Add role to user by userId (Available only to the admin)',
  })
  @ApiResponse({ status: 200, type: User })
  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/role')
  addRoleByPk(@Body() dto: AddRoleDto) {
    return this.usersService.addRoleByPk(dto);
  }

  @ApiBody({ type: BanUserDto })
  @ApiOperation({ summary: 'Bun user by userId (Available only to the admin)' })
  @ApiResponse({ status: 200, type: User })
  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @Post('/ban')
  banByPk(@Body() dto: BanUserDto) {
    return this.usersService.banUserByPk(dto);
  }
}
