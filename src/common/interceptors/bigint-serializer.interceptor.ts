import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntSerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return JSON.parse(JSON.stringify(data, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        }));
      }),
    );
  }
}
