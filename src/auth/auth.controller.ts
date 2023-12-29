import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('/register')
  userRegister(@Body() user: RegisterUserDto) {
    return this.auth.userRegister(user);
  }

  @Post('/login')
  userLogin(@Body() user: LoginUserDto) {
    return this.auth.userLogin(user);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
