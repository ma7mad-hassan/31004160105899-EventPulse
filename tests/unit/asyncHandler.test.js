const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler Utility Unit Tests', () => {
  test('should successfully execute passed async function', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const fn = jest.fn().mockResolvedValue('success');
    const wrappedFn = asyncHandler(fn);

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should catch errors from async function and pass them to next()', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const testError = new Error('Async failure');
    const fn = jest.fn().mockRejectedValue(testError);
    const wrappedFn = asyncHandler(fn);

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(testError);
  });
});