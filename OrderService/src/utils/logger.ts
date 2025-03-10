// import fs from 'fs';
// import path from 'path';
// import { format } from 'util';

// enum LogLevel {
//   DEBUG = 'DEBUG',
//   INFO = 'INFO',
//   WARN = 'WARN',
//   ERROR = 'ERROR',
// }

// class Logger {
//   private logDir: string;
//   private logFilePath: string;
//   private consoleOutput: boolean;
//   private fileOutput: boolean;

//   constructor() {
//     this.logDir = path.join(process.cwd(), 'logs');
//     this.ensureLogDirExists();

//     const now = new Date();
//     const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
//     this.logFilePath = path.join(this.logDir, `order-service-${dateStr}.log`);

//     this.consoleOutput = process.env.LOG_TO_CONSOLE == 'true';
//     this.fileOutput = process.env.LOG_TO_FILE == 'true';
//   }

//   private ensureLogDirExists(): void {
//     if (!fs.existsSync(this.logDir)) {
//       fs.mkdirSync(this.logDir, { recursive: true });
//     }
//   }

//   private getTimestamp(): string {
//     const now = new Date();
//     return now.toISOString();
//   }

//   private formatMessage(level: LogLevel, message: string, meta?: any): string {
//     const timestamp = this.getTimestamp();
//     let formattedMessage = `[${timestamp}] [${level}] ${message}`;
    
//     if (meta) {
//       if (typeof meta === 'object') {
//         try {
//           const metaStr = JSON.stringify(meta, null, 2);
//           formattedMessage += `\n${metaStr}`;
//         } catch (error) {
//           formattedMessage += `\n[Unserializable Object]: ${format(meta)}`;
//         }
//       } else {
//         formattedMessage += `\n${format(meta)}`;
//       }
//     }
    
//     return formattedMessage;
//   }

//   private writeToFile(message: string): void {
//     if (!this.fileOutput) return;

//     fs.appendFile(this.logFilePath, message + '\n', (err) => {
//       if (err) {
//         console.error('Error writing to log file:', err);
//       }
//     });
//   }

//   private writeToConsole(level: LogLevel, message: string): void {
//     if (!this.consoleOutput) return;

//     switch (level) {
//       case LogLevel.DEBUG:
//       case LogLevel.INFO:
//         console.log(message);
//         break;
//       case LogLevel.WARN:
//         console.warn(message);
//         break;
//       case LogLevel.ERROR:
//         console.error(message);
//         break;
//     }
//   }

//   private log(level: LogLevel, message: string, meta?: any): void {
//     const formattedMessage = this.formatMessage(level, message, meta);
//     this.writeToConsole(level, formattedMessage);
//     this.writeToFile(formattedMessage);
//   }

//   debug(message: string, meta?: any): void {
//     this.log(LogLevel.DEBUG, message, meta);
//   }

//   info(message: string, meta?: any): void {
//     this.log(LogLevel.INFO, message, meta);
//   }

//   warn(message: string, meta?: any): void {
//     this.log(LogLevel.WARN, message, meta);
//   }

//   error(message: string, meta?: any): void {
//     this.log(LogLevel.ERROR, message, meta);
//   }

//   // Special logs for http calls
//   // special logs for http response
//   logResponse(method: string, url: string, statusCode: number, responseData?: any, duration?: number): void {
//     const meta = {
//       duration: duration ? `${duration}ms` : 'N/A',
//       statusCode,
//       responseData
//     };

//     this.info(`${method} ${url} - Status ${statusCode}`, meta);
//   }

//   // For http request
//   logRequest(method: string, url: string, requestData?: any): void {
//     this.info(`${method} ${url}`, { requestData });
//   }

//   // for calls between services
//   logServiceCall(service: string, method: string, endpoint: string, requestData?: any): void {
//     this.debug(`Service call to ${service}: ${method} ${endpoint}`, { requestData });
//   }

//   // for response between services
//   logServiceResponse(service: string, method: string, endpoint: string, statusCode: number, responseData?: any, duration?: number): void {
//     const meta = {
//       duration: duration ? `${duration}ms` : 'N/A',
//       statusCode,
//       responseData
//     };

//     this.debug(`Response from ${service}: ${method} ${endpoint} - Status ${statusCode}`, meta);
//   }
// }

// // single instnce
// export const logger = new Logger();

// export default logger;