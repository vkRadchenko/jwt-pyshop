import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://vkrad4enko_jwt_test:sUHEoBlq5wI9lzfg@cluster0.x7z35ha.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'spa'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
