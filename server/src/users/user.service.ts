import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity } from 'src/models/User.entity';
import { Model } from 'mongoose';
import { UserResponseType } from 'src/types/userResponse.type';
import { LoginDto } from './dto/loginDto';
import { compare } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { TokenEntity } from 'src/models/Token.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    @InjectModel(TokenEntity.name) private tokenModel: Model<TokenEntity>,
    private configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userModel.findOne({ email: createUserDto.email });
      if (user) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    } catch (error) {
      throw new HttpException(
        'Ошибка создания пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userId, userEntity: UserEntity) {
    try {
      const existingUser = await this.userModel.findById(userId);
      if (!existingUser) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      const updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        userEntity,
        { new: true },
      );
      return updateUser;
    } catch (error) {
      throw new HttpException(
        'Ошибка обновления пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginDto: LoginDto): Promise<UserEntity> {
    try {
      const user = await this.userModel
        .findOne({ email: loginDto.email })
        .select('+password');

      if (!user) {
        throw new HttpException(
          'Пользователь не найден',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const isPasswordCorrect = await compare(loginDto.password, user.password);

      if (!isPasswordCorrect) {
        throw new HttpException(
          'Неправильный пароль',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        'Ошибка входа в систему',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  buildUserResponse(userEntity: UserEntity): UserResponseType {
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
    } catch (error) {
      throw new HttpException(
        'Ошибка построения ответа пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateJwt(userEntity: UserEntity) {
    try {
      const accsessToken = sign(
        { userId: userEntity._id },
        this.configService.get('accessSecret'),
        { expiresIn: '3600s' },
      );
      const refreshToken = sign(
        { userId: userEntity._id },
        this.configService.get('refreshSecret'),
      );
      return { accsessToken, refreshToken, expiresIn: 3600 };
    } catch (error) {
      throw new HttpException(
        'Ошибка генерации токена',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveTokens(userId, refreshToken: string) {
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
    } catch (error) {
      throw new HttpException(
        'Ошибка сохранения токена',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateToken(refreshToken: any) {
    try {
      return verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_KEY'),
      ) as JwtPayload;
    } catch (error) {
      throw new HttpException(
        'Ошибка проверки токена',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  async refreShToken(refreshToken: any) {
    try {
      return await this.tokenModel.findOne({ refreshToken });
    } catch (error) {
      throw new HttpException(
        'Ошибка обновления токена',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(userId: string): Promise<UserEntity> {
    try {
      return this.userModel.findOne({ _id: userId });
    } catch (error) {
      throw new HttpException(
        'Ошибка поиска пользователя',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
