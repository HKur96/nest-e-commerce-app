import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseLowercaseEnumPipe<T> implements PipeTransform {
  constructor(private readonly enumType: Record<string, any>) {}

  transform(value: string): T {
    const upperValue = value.toUpperCase();

    const enumValues = Object.values(this.enumType);
    if (!enumValues.includes(upperValue)) {
      throw new BadRequestException(
        `Invalid value '${value}'. Allowed values: ${enumValues.join(', ')}`,
      );
    }

    return upperValue as T;
  }
}
