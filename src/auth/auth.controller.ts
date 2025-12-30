import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string
  ) {
    if (!email || !token || !newPassword) {
      throw new BadRequestException('Missing parameters');
    }
    return this.authService.resetPassword(email, token, newPassword);
  }
}