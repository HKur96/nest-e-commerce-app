import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../response/api.response.dto';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If it's already an ApiResponseDto, use its status_code
        if (data instanceof ApiResponseDto) {
          response.status(data.meta.status_code);
          return data;
        }

        // Otherwise, wrap it in a success response
        const apiResponse = ApiResponseDto.success('Request successful', data);
        response.status(apiResponse.meta.status_code);
        return apiResponse;
      }),
    );
  }
}
