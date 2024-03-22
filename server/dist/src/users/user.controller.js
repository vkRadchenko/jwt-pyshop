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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const createUserDto_1 = require("./dto/createUserDto");
const loginDto_1 = require("./dto/loginDto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(createUserDto) {
        const user = await this.userService.createUser(createUserDto);
        const tokens = await this.userService.buildUserResponse(user);
        const userId = user._id.toString();
        await this.userService.saveTokens(userId, tokens.refresh_token);
        return tokens;
    }
    async login(loginDto) {
        const user = await this.userService.loginUser(loginDto);
        const tokens = this.userService.buildUserResponse(user);
        await this.userService.saveTokens(user._id, tokens.refresh_token);
        return tokens;
    }
    async tokenRefresh(token) {
        const data = await this.userService.validateToken(token.refresh_token);
        const dbToken = await this.userService.refreShToken(token.refresh_token);
        if (!data || !dbToken)
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        const tokens = await this.userService.generateJwt(data.userId);
        await this.userService.saveTokens(data.userId, tokens.refreshToken);
        return { ...tokens, userId: data.userId };
    }
    async currentUser(request) {
        if (!request.user)
            throw new common_1.HttpException('Ошибка - Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        const tokens = await this.userService.buildUserResponse(request.user);
        return tokens;
    }
    async editUser(request) {
        if (!request.user)
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        const { userId } = request.params;
        if (userId === request.user._id.toString()) {
            await this.userService.updateUser(userId, request.body);
        }
        const tokens = this.userService.buildUserResponse(request.user);
        await this.userService.saveTokens(request.user._id, tokens.refresh_token);
        return tokens;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('auth/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUserDto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('auth/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginDto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "tokenRefresh", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "currentUser", null);
__decorate([
    (0, common_1.Patch)('user/:userId'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map