import { ExpressRequest } from './../middleware/auth.middleware';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserResponseType } from 'src/types/userResponse.type';
import { LoginDto } from './dto/loginDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseType> {
    const user = await this.userService.createUser(createUserDto);
    const tokens = await this.userService.buildUserResponse(user);
    const userId = user._id.toString();

    await this.userService.saveTokens(userId, tokens.refresh_token);

    return tokens;
  }

  @Post('auth/signin')
  async login(@Body() loginDto: LoginDto): Promise<UserResponseType> {
    const user = await this.userService.loginUser(loginDto);
    const tokens = this.userService.buildUserResponse(user);

    await this.userService.saveTokens(user._id, tokens.refresh_token);
    return tokens;
  }

  @Post('auth/token')
  async tokenRefresh(@Body() token: any) {
    const data = await this.userService.validateToken(token.refresh_token);
    const dbToken = await this.userService.refreShToken(token.refresh_token);

    if (!data || !dbToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const tokens = await this.userService.generateJwt(data.userId);

    await this.userService.saveTokens(data.userId, tokens.refreshToken);

    return { ...tokens, userId: data.userId };
  }

  @Get('user')
  async currentUser(@Request() request: ExpressRequest) {
    if (!request.user)
      throw new HttpException('Ошибка - Unauthorized', HttpStatus.UNAUTHORIZED);

    const tokens = await this.userService.buildUserResponse(request.user);

    return tokens;
  }

  @Patch('user/:userId')
  async editUser(@Request() request: ExpressRequest) {
    if (!request.user)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { userId } = request.params;

    if (userId === request.user._id.toString()) {
      await this.userService.updateUser(userId, request.body);
    }
    const tokens = this.userService.buildUserResponse(request.user);

    await this.userService.saveTokens(request.user._id, tokens.refresh_token);
    return tokens;
  }
}
