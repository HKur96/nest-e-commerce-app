import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../response/api.response';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If it's already an ApiResponse, use its status_code
        if (data instanceof ApiResponse) {
          response.status(data.meta.status_code);
          return data;
        }

        // Otherwise, wrap it in a success response
        const apiResponse = ApiResponse.success('Request successful', data);
        response.status(apiResponse.meta.status_code);
        return apiResponse;
      }),
    );
  }
}
