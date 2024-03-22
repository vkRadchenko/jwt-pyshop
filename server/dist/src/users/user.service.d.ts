/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { CreateUserDto } from './dto/createUserDto';
import { UserEntity } from 'src/models/User.entity';
import { Model } from 'mongoose';
import { UserResponseType } from 'src/types/userResponse.type';
import { LoginDto } from './dto/loginDto';
import { JwtPayload } from 'jsonwebtoken';
import { TokenEntity } from 'src/models/Token.entity';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private userModel;
    private tokenModel;
    private configService;
    constructor(userModel: Model<UserEntity>, tokenModel: Model<TokenEntity>, configService: ConfigService);
    createUser(createUserDto: CreateUserDto): Promise<UserEntity>;
    updateUser(userId: any, userEntity: UserEntity): Promise<import("mongoose").Document<unknown, {}, UserEntity> & UserEntity & Required<{
        _id: string;
    }>>;
    loginUser(loginDto: LoginDto): Promise<UserEntity>;
    buildUserResponse(userEntity: UserEntity): UserResponseType;
    generateJwt(userEntity: UserEntity): {
        accsessToken: string;
        refreshToken: string;
        expiresIn: number;
    };
    saveTokens(userId: any, refreshToken: string): Promise<import("mongoose").Document<unknown, {}, TokenEntity> & TokenEntity & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    validateToken(refreshToken: any): Promise<JwtPayload>;
    refreShToken(refreshToken: any): Promise<import("mongoose").Document<unknown, {}, TokenEntity> & TokenEntity & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByEmail(userId: string): Promise<UserEntity>;
}
