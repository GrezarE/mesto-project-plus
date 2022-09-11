import { Request, Response } from 'express';
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} from '../utiles/constants';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  Card.findById(id)
    .then((card) => {
      const cardId = card?.owner.toString();
      if (cardId !== userId) {
        res.status(FORBIDDEN).send({ message: 'Недостаточно прав' });
      } else {
        Card.findByIdAndRemove(id)
          .then((card) => {
            if (!card) {
              res
                .status(NOT_FOUND)
                .send({ message: 'Карточка с указанным id не найдена.' });
            } else {
              res.send(card);
            }
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              res
                .status(BAD_REQUEST)
                .send({ message: 'Id карточки не прошло валидацию' });
            } else {
              res
                .status(SERVER_ERROR)
                .send({ message: 'Произошла ошибка сервера' });
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Id карточки не прошло валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const putCardLike = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Запрос на постановку лайка не прошел валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

export const deleteCardLike = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Запрос на удаление лайка не прошел валидацию' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};
