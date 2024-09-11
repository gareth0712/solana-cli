import chalk from 'chalk';

export const logger = {
  lastStart: 0,
  log(...args: any[]) {
    console.log(...args);
  },
  section(...args: any[]) {
    console.log(chalk.yellow(...args));
  },
  title(...args: any[]) {
    console.log(chalk.blue(...args));
  },
  time(text: string) {
    this.lastStart = Date.now();
    console.log(chalk.blue(text));
  },
  success(text: string, ...args: any[]) {
    if (this.lastStart === 0) return console.log(chalk.green(`${text}`), ...args);
    console.log(chalk.green(`${text} (in ${Date.now() - this.lastStart}ms)`, ...args));
    this.lastStart = 0;
  },
  fail(text: string, ...args: any[]) {
    if (this.lastStart === 0) return console.log(chalk.red(`${text}`), ...args);
    console.log(chalk.red(`${text} (in ${Date.now() - this.lastStart}ms)`), ...args);
    this.lastStart = 0;
  },
  expect(success: boolean, errorMessage: string, ...args: any[]) {
    if (!success) console.error(errorMessage, ...args);
  },
};
