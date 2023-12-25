import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { classValidatorErrorDto } from './common/dto/classValidator.dto';
import { ExceptionErrorDto } from './common/dto/ExceptionError.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { message: any; statusCode: number }
      | classValidatorErrorDto;

    //class-validator
    if (isClassValidatorError(err)) {
      const error = err as classValidatorErrorDto;
      return response.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
      } as ExceptionErrorDto);
    }

    //HttpException
    if (typeof err == 'string') {
      return response.status(status).json({
        success: false,
        statusCode: status,
        message: [err],
      } as ExceptionErrorDto);
    }

    //BadRequestException, UnauthorizedException
    if (typeof err.message == 'string') {
      return response.status(status).json({
        success: false,
        statusCode: status,
        message: [err.message],
      } as ExceptionErrorDto);
    }

    console.log('확인되지 않은 Error 타입 : ', err);
  }
}

function isClassValidatorError(obj: any) {
  return (
    typeof obj !== 'string' &&
    typeof obj.error === 'string' &&
    obj.statusCode === 400 &&
    Array.isArray(obj.message) &&
    obj.message.every((m) => typeof m === 'string')
  );
}
