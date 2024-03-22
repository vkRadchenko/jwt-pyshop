/* import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  async use(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpException) {
      res.status(err.getStatus()).json({
        statusCode: err.getStatus(),
        message: err.message,
        next,
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
 */
