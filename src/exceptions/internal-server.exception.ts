export class InternalServerException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "Internal Server Error";
    this.status = 500;
    return this;
  }
}
