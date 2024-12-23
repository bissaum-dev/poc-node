import { Log, Timestamp } from '@/utils/log';

const timestamp = Timestamp();

jest.mock('cli-color', () => ({
  black: jest.fn((input: string) => input),
  white: jest.fn((input: string) => input),
  blue: jest.fn((input: string) => input),
  green: jest.fn((input: string) => input),
  yellow: jest.fn((input: string) => input),
  red: jest.fn((input: string) => input),
}));

describe('Log Utils', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  it('should log a muted message correctly', () => {
    const label = 'MutedLabel';
    const message = 'Muted message';
    Log.Muted(label, message);
    expect(console.log).toHaveBeenCalledWith(
      `${timestamp} ${label} ${message}`,
    );
  });

  it('should log an info message correctly', () => {
    const label = 'InfoLabel';
    const message = 'Info message';
    Log.Info(label, message);
    expect(console.log).toHaveBeenCalledWith(
      `${timestamp} ${label} ${message}`,
    );
  });

  it('should log a success message correctly', () => {
    const label = 'SuccessLabel';
    const message = 'Success message';
    Log.Success(label, message);
    expect(console.log).toHaveBeenCalledWith(
      `${timestamp} ${label} ${message}`,
    );
  });

  it('should log a warning message correctly', () => {
    const label = 'WarningLabel';
    const message = 'Warning message';
    Log.Warning(label, message);
    expect(console.log).toHaveBeenCalledWith(
      `${timestamp} ${label} ${message}`,
    );
  });

  it('should log a fatal message correctly', () => {
    const label = 'FatalLabel';
    const message = 'Fatal message';
    Log.Fatal(label, message);
    expect(console.error).toHaveBeenCalledWith(
      `${timestamp} ${label} ${message}`,
    );
  });
});
