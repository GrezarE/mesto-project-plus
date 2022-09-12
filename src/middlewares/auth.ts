import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/index';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = () => {
  throw new UnauthorizedError('Необходима авторизация');
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError();
  }

  req.user = payload;

  next();
};
