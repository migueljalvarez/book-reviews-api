export class BadRequestException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "Bad Request";
    this.status = 400;
    return this;
  }
}
