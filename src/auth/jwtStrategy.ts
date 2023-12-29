import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PayloadDto } from './dto/payloadDto';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      secretOrKey: 'topSecret101',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: PayloadDto): Promise<User> {
    const { username } = payload;
    const user: User = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
