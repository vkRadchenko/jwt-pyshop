import { ExpressRequest } from './../middleware/auth.middleware';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserResponseType } from 'src/types/userResponse.type';
import { LoginDto } from './dto/loginDto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseType>;
    login(loginDto: LoginDto): Promise<UserResponseType>;
    tokenRefresh(token: any): Promise<{
        userId: any;
        accsessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    currentUser(request: ExpressRequest): Promise<UserResponseType>;
    editUser(request: ExpressRequest): Promise<UserResponseType>;
}
