export default class KnownError extends Error {
  public message: string;
  public statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
