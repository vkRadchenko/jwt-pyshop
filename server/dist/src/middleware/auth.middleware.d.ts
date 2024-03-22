import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/user.service';
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from 'src/models/User.entity';
export interface ExpressRequest extends Request {
    user?: UserEntity;
}
export declare class AuthMiddleware implements NestMiddleware {
    private readonly userService;
    private configService;
    constructor(userService: UserService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
