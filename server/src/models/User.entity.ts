import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';

@Schema()
export class UserEntity {
  _id?: string;
  @Prop()
  username?: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  phone: number;
  @Prop()
  adress: string;
}
export const UserEntityShema = SchemaFactory.createForClass(UserEntity);

UserEntityShema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10);

  next();
});
