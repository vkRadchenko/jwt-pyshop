import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/models/User.entity';

export interface ExpressRequest extends Request {
  user?: UserEntity;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers['authorization'].split(' ')[1];

    try {
      const decode = verify(token, this.configService.get('accessSecret')) as {
        userId: string;
      };

      const user = await this.userService.findByEmail(decode.userId);

      req.user = user;
      next();
    } catch (error) {
      console.log('Error', error);
      req.user = null;
      next();
    }
  }
}
