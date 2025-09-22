export class ApiResponse<T = any> {
  meta: {
    success: boolean;
    message: string;
    status_code: number;
    timestamp: string;
  };
  data?: T;

  constructor(
    message: string,
    options: {
      data?: T;
      success?: boolean;
      status_code?: number;
    } = {},
  ) {
    this.data = options.data || null;
    this.meta = {
      success: options.success ?? true,
      message,
      status_code: options.status_code ?? 200,
      timestamp: new Date().toISOString(),
    };
  }

  static success<T>(message: string, data?: T, status_code = 200) {
    return new ApiResponse<T>(message, { data, success: true, status_code });
  }

  static error(message: string, status_code = 400) {
    return new ApiResponse(message, { success: false, status_code });
  }
}
