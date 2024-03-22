import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  accsessToken: string;
  @IsNotEmpty()
  rrefreshToken: string;
  @IsNotEmpty()
  expiresIn: number;
  @IsNotEmpty()
  email: string;
}
