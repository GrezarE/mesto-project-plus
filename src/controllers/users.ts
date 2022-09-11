import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
} from '../utiles/constants';
import User from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar, password, email } = req.body;

  bcrypt
    .hash(password, 15)
    .then((hash) => User.create({ name, about, avatar, password: hash, email }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const getMe = (req: Request, res: Response) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Id пользователя не прошло валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Id пользователя не прошло валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

export const patchUser = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при изменении пользователя',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const patchAvatar = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при изменении аватара',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key');
      // res.send({
      //   token: jwt.sign({ _id: user._id }, 'some-secret-key', {
      //     expiresIn: '7d',
      //   }),
      // });
      res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};
