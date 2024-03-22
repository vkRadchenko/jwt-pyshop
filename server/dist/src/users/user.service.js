"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const User_entity_1 = require("../models/User.entity");
const mongoose_2 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const Token_entity_1 = require("../models/Token.entity");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(userModel, tokenModel, configService) {
        this.userModel = userModel;
        this.tokenModel = tokenModel;
        this.configService = configService;
    }
    async createUser(createUserDto) {
        try {
            const user = await this.userModel.findOne({ email: createUserDto.email });
            if (user) {
                throw new common_1.HttpException('Пользователь с таким email уже существует', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const createdUser = new this.userModel(createUserDto);
            return createdUser.save();
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка создания пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(userId, userEntity) {
        try {
            const existingUser = await this.userModel.findById(userId);
            if (!existingUser) {
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.NOT_FOUND);
            }
            const updateUser = await this.userModel.findByIdAndUpdate(userId, userEntity, { new: true });
            return updateUser;
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка обновления пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginUser(loginDto) {
        try {
            const user = await this.userModel
                .findOne({ email: loginDto.email })
                .select('+password');
            if (!user) {
                throw new common_1.HttpException('Пользователь не найден', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const isPasswordCorrect = await (0, bcryptjs_1.compare)(loginDto.password, user.password);
            if (!isPasswordCorrect) {
                throw new common_1.HttpException('Неправильный пароль', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return user;
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка входа в систему', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    buildUserResponse(userEntity) {
        try {
            const tokens = this.generateJwt(userEntity);
            return {
                username: userEntity.username,
                email: userEntity.email,
                userId: userEntity._id,
                adress: userEntity.adress,
                phone: userEntity.phone,
                access_token: tokens.accsessToken,
                refresh_token: tokens.refreshToken,
                expiresIn: 3600,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка построения ответа пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    generateJwt(userEntity) {
        try {
            const accsessToken = (0, jsonwebtoken_1.sign)({ userId: userEntity._id }, this.configService.get('accessSecret'), { expiresIn: '3600s' });
            const refreshToken = (0, jsonwebtoken_1.sign)({ userId: userEntity._id }, this.configService.get('refreshSecret'));
            return { accsessToken, refreshToken, expiresIn: 3600 };
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка генерации токена', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async saveTokens(userId, refreshToken) {
        try {
            const foundToken = await this.tokenModel.findOne({ user: userId });
            if (foundToken) {
                foundToken.refreshToken = refreshToken;
                return foundToken.save();
            }
            const newToken = await this.tokenModel.create({
                user: userId,
                refreshToken,
            });
            return newToken;
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка сохранения токена', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateToken(refreshToken) {
        try {
            return (0, jsonwebtoken_1.verify)(refreshToken, this.configService.get('JWT_REFRESH_KEY'));
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка проверки токена', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async refreShToken(refreshToken) {
        try {
            return await this.tokenModel.findOne({ refreshToken });
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка обновления токена', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByEmail(userId) {
        try {
            return this.userModel.findOne({ _id: userId });
        }
        catch (error) {
            throw new common_1.HttpException('Ошибка поиска пользователя', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_entity_1.UserEntity.name)),
    __param(1, (0, mongoose_1.InjectModel)(Token_entity_1.TokenEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map