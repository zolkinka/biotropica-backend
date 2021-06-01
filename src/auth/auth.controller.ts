import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: 'Bearer token' })
  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
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

  @ApiResponse({ status: 200, type: ForgotPasswordDto })
  @Post('/forgotPassword')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiResponse({ status: 200 })
  @Get('/restorePassword')
  restorePassword(@Query('token') token: string, @Res() res: Response) {
    return this.authService.restorePassword(token, res);
  }

  @ApiResponse({ status: 200, type: ChangePasswordDto })
  @UseGuards(JwtAuthGuard)
  @Patch('/changePassword')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req['user'];
    return this.authService.changePassword(user.id, dto);
  }
}
