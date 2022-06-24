class CustomError {
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

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

class AuthorizationError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

class ServerError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}

export {
  CustomError,
  BadRequestError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ServerError,
};
