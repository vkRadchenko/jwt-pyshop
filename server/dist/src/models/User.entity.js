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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntityShema = exports.UserEntity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcryptjs_1 = require("bcryptjs");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UserEntity.prototype, "adress", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, mongoose_1.Schema)()
], UserEntity);
exports.UserEntityShema = mongoose_1.SchemaFactory.createForClass(UserEntity);
exports.UserEntityShema.pre('save', async function (next) {
    this.password = await (0, bcryptjs_1.hash)(this.password, 10);
    next();
});
//# sourceMappingURL=User.entity.js.map