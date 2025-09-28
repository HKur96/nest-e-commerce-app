export class ApiResponseDto<T = any> {
  meta: {
    success: boolean;
    message: string;
    status_code: number;
    timestamp: string;
    page?: number;
    total_page?: number;
  };
  data?: T;

  constructor(
    message: string,
    options: {
      data?: T;
      success?: boolean;
      status_code?: number;
      page?: number;
      total_page?: number;
    } = {},
  ) {
    this.data = options.data || null;
    this.meta = {
      success: options.success ?? true,
      message,
      status_code: options.status_code ?? 200,
      timestamp: new Date().toISOString(),
    };

    if (options.page !== undefined && options.page !== null) {
      this.meta.page = options.page;
    }

    if (options.total_page !== undefined && options.total_page !== null) {
      this.meta.total_page = options.total_page;
    }
  }

  static success<T>(
    message: string,
    data?: T,
    status_code = 200,
    page?: number,
    total_page?: number,
  ) {
    return new ApiResponseDto<T>(message, {
      data,
      success: true,
      status_code,
      page,
      total_page,
    });
  }

  static error(message: string, status_code = 400) {
    return new ApiResponseDto(message, { success: false, status_code });
  }
}
