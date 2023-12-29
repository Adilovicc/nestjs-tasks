import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/registerUserDto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/loginUserDto';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payloadDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(pass: string, hashedPass: string): Promise<boolean> {
    const check = await bcrypt.compare(pass, hashedPass);
    return check;
  }

  async userRegister(user: RegisterUserDto): Promise<string> {
    const exist = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { username: user.username }],
      },
    });

    if (exist) return 'User with this email or username already exists!';

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(user.password, salt);

    const result = await this.prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashed,
        name: user.name,
      },
    });

    if (result) return `User ${result.username} has been created successfully!`;
    return 'Something went wrong!';
  }

  async userLogin(user: LoginUserDto): Promise<string | { token: string }> {
    const result = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.username }, { username: user.username }],
      },
    });

    if (!result) {
      throw new BadRequestException('Login failed');
    }

    if (!this.comparePasswords(user.password, result.password)) {
      throw new UnauthorizedException('Incorrect password');
    }

    const username = user.username;
    const payload: PayloadDto = { username };
    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
