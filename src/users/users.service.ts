import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleType } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async getAllUsers() {
    const roles = await this.userRepository.findAll({ include: { all: true } });
    return roles;
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByName(RoleType.USER);

    await user.$set('roles', [role.id]);
    user.roles = [role];

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return user;
  }

  async updateUser(userId: number, fields: any) {
    const user = await this.userRepository.findByPk(userId);
    await user.update(fields);
  }

  async getUserByConfirmedHash(confirmedHash: string) {
    const user = await this.userRepository.findOne({
      where: { confirmed_hash: confirmedHash },
      include: { all: true },
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async addRoleByPk(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId, {
      include: { all: true },
    });
    const role = await this.rolesService.getRoleByName(dto.name);

    if (!role || !user) {
      throw new HttpException('Role or user not found', HttpStatus.NOT_FOUND);
    }

    await user.$add('role', role.id);

    return user;
  }

  async banUserByPk(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.banned = dto.banned;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}
