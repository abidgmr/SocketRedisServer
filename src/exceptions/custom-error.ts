"use-strict"
export default class CustomError extends Error {
  message!: string;
  status!: number;
  additionalInfo!: unknown;

  constructor(message: string, status: number = 500, additionalInfo: unknown = undefined) {
    super(message);
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}
