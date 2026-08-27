const AppError = require('../../utils/appError');

describe('AppError Utility Unit Tests', () => {
  test('should set statusCode to 404 and status to "fail" for 4xx errors', () => {
    const error = new AppError('Not found', 404);

    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.message).toBe('Not found');
  });

  test('should set statusCode to 500 and status to "error" for 5xx errors', () => {
    const error = new AppError('Server error', 500);

    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.message).toBe('Server error');
  });

  test('should set isOperational property to default true', () => {
    const error = new AppError('Operational error', 400);

    expect(error.isOperational).toBe(true);
  });

  test('should be an instance of native JavaScript Error', () => {
    const error = new AppError('Test error', 400);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });
});