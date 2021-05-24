import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

import { Role, RoleType } from './roles.model';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getAll() {
    return this.rolesService.getAllRoles();
  }

  @ApiOperation({ summary: 'Create role (Available only to the admin)' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, type: Role })
  @Roles(RoleType.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @ApiOperation({ summary: 'Get role by name' })
  @ApiBody({ type: GetRoleByNameDto })
  @ApiResponse({ status: 200, type: Role })
  @Get('/:name')
  getByName(@Param('name') name: string) {
    return this.rolesService.getRoleByName(name.toUpperCase());
  }
}
