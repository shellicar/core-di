
class DebugLogger {
  private debugging = false;

  public enable() { this.debugging = true; }
  public disable() { this.debugging = false; }
  public log(message?: string, ...optionalParams: unknown[]) {
    if(this.debugging) {
      console.log(message, ...optionalParams);
    }
  }
}

const logger = new DebugLogger();

export const log = logger.log.bind(logger);
export const enable = logger.enable.bind(logger);
export const disable = logger.disable.bind(logger);
