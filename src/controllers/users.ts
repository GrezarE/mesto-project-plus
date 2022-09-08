import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../utiles/constants';
import User from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  if (!name) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле name не должно быть пустым' });
  }
  if (!about) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле about не должно быть пустым' });
  }
  if (!avatar) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле avatar не должно быть пустым' });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const patchUser = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { name, about } = req.body;

  if (!name) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле name не должно быть пустым' });
  }
  if (!about) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле about не должно быть пустым' });
  }

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const patchAvatar = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { avatar } = req.body;

  if (!avatar) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле avatar не должно быть пустым' });
  }

  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
