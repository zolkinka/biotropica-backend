import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: 'Bearer token' })
  @Post('/signin')
  signin(@Body() dto: CreateUserDto) {
    return this.authService.signin(dto);
  }

  @Post('/signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiResponse({ status: 200, type: VerifyEmailDto })
  @Get('/verify')
  verifyByEmail(
    @Query('confirmedHash') confirmedHash: string,
    @Res() res: Response,
  ) {
    return this.authService.verifyByEmail(confirmedHash, res);
  }
}
