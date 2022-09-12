import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { BadRequestError, NotFoundError, ConflictError } from '../errors/index';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  bcrypt
    .hash(password, 15)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      password: hash,
      email,
    }))
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        const error = new ConflictError(
          'Пользователь с такой почтой уже существует',
        );
        next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Id пользователя не прошло валидацию',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Id пользователя не прошло валидацию',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const patchUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при изменении пользователя',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const patchAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при изменении пользователя',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        }),
      });
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      // res
      //   .cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      //   .end();
    })
    .catch(next);
};
