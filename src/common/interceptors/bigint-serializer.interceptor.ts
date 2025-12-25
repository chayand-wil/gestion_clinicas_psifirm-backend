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
  // Intercepta la respuesta de la API
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Procesa la respuesta antes de enviarla al cliente
    return next.handle().pipe(
      // Transforma los datos usando el operador map de RxJS
      map((data) => {
        // Serializa a JSON y deserializa, convirtiendo bigint a string
        return JSON.parse(JSON.stringify(data, (key, value) => {
          // Si el valor es de tipo bigint, lo convierte a string
          if (typeof value === 'bigint') {
            return value.toString();
          }
          // Para otros tipos, retorna el valor sin cambios
          return value;
        }));
      }),
    );
  }
}
