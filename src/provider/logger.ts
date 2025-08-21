export default class Logger {
  private static colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    fg: {
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    },
  };
  static info(context: string, message: string, method?: string) {
    const msg = method ? `${method} ${message}` : message;
    console.info(`${this.colors.fg.green}[INFO][${context}]${this.colors.reset}: ${msg}`);
  }
  static debug() {}
  static warn(context: string, message: string) {
    console.warn(`${this.colors.fg.yellow}[WARN][${context}]${this.colors.reset}: ${message}`);
  }
  static error(context: string, message: string, method?: string | null, data?: object) {
    const msg = method ? `${method} ${message}` : message;
    console.error(`${this.colors.fg.red}[ERROR][${context}]${this.colors.reset}: ${msg}`, data);
  }
}
