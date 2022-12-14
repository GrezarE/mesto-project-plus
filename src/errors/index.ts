/* eslint-disable max-classes-per-file */

export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = name || 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, name = 'NotFoundError', code = 404) {
    super(message, name, code);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string, name = 'ForbiddenError', code = 403) {
    super(message, name, code);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, name = 'BadRequestError', code = 400) {
    super(message, name, code);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string, name = 'UnauthorizedError', code = 401) {
    super(message, name, code);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, name = 'ConflictError', code = 409) {
    super(message, name, code);
  }
}

module.exports = {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
};
