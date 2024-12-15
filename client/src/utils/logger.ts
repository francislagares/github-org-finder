type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private log(entry: LogEntry): void {
    if (this.isDevelopment) {
      const logFn = console[entry.level] || console.log;
      logFn(
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data ? entry.data : '',
      );
    }

    // In production, you might want to send logs to a logging service
    if (!this.isDevelopment) {
      // Implement production logging here
      // e.g., send to logging service
    }
  }

  public info(message: string, data?: unknown): void {
    this.log(this.createLogEntry('info', message, data));
  }

  public warn(message: string, data?: unknown): void {
    this.log(this.createLogEntry('warn', message, data));
  }

  public error(message: string, data?: unknown): void {
    this.log(this.createLogEntry('error', message, data));
  }
}

export default new Logger();
