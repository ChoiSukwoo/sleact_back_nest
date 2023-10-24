import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] };

    //class-validator
    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: err.statusCode,
        data: err.message,
      });
    }

    //HttpException
    if (typeof err == 'string') {
      return response.status(status).json({
        success: false,
        code: status,
        data: err,
      });
    }

    //BadRequestException, UnauthorizedException
    return response.status(status).json({
      success: false,
      code: status,
      data: err.message,
    });
  }
}
