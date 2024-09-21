/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class ILogger {
  public debug(message?: any, ...optionalParams: any[]) {}
  public info(message?: any, ...optionalParams: any[]) {}
  public error(message?: any, ...optionalParams: any[]) {}
  public warn(message?: any, ...optionalParams: any[]) {}
}
