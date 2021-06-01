import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async getAllRoles() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async createRole(dto: CreateRoleDto) {
    const candidate = await this.getRoleByName(dto.name);

    if (candidate) {
      throw new HttpException(
        'The role already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.roleRepository.create(dto);
    return role;
  }

  async getRoleByName(name: string) {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (!role) throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    return role;
  }
}
