import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../utiles/constants';
import User from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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
