export class CustomError {
  message: string;
  statusCode: number;
  additionalInfo: any;

  constructor(
    message: string,
    statusCode: number = 500,
    additionalInfo: any = {}
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.additionalInfo = additionalInfo;
  }
}
