export class NotFoundException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = "Not Found";
    this.status = 404;
    this.getInstance();
  }
  getInstance() {
    return {
      ...this,
    };
  }
}
