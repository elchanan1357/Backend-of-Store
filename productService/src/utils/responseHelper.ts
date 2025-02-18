export const successResponse = <T>(data?: T) => ({
  success: true,
  data,
});

export const errorResponse = <T>(message: string, status = 500, data?: T) => ({
  success: false,
  error: { message, status },
  data,
});