import { UserEntity } from 'src/models/User.entity';

export type UserResponseType = Omit<UserEntity, 'password'> & {
  access_token: string;
  refresh_token: string;
  expiresIn: number;
  userId: string;
};
