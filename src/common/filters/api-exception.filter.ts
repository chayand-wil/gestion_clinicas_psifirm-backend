import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Ensures all error responses follow the standard wrapper:
 * { success: false, data: null | object, message: string }
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response: any = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (response && typeof response === 'object') {
        const m = response.message;
        message = Array.isArray(m) ? m.join(', ') : (m ?? message);
        if ('data' in response) {
          data = response.data;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    res.status(status).json({
      success: false,
      data,
      message,
    });
  }
}
