import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index';

export default (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Консоль ошибки', err.message, err.statusCode);
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};
