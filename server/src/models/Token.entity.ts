import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { UserEntity } from './User.entity';

@Schema()
export class TokenEntity {
  @Prop({ type: SchemaTypes.ObjectId, ref: UserEntity.name })
  user: Types.ObjectId;
  @Prop()
  refreshToken: string;
}
export const TokenEntityShema = SchemaFactory.createForClass(TokenEntity);
