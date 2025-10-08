import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseInsensitiveEnumPipe<T> implements PipeTransform {
  constructor(private readonly enumType: Record<string, any>) {}

  transform(value: string): T {
    const enumValues = Object.values(this.enumType);

    const matchedValue = enumValues.find(
      (enumVal) => enumVal.toLowerCase?.() === value.toLowerCase(),
    );

    if (!matchedValue) {
      throw new BadRequestException(
        `Invalid value '${value}'. Allowed values: ${enumValues.join(', ')}`,
      );
    }

    return matchedValue as T;
  }
}
