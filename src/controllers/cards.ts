import { Request, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../utiles/constants';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { name, link } = req.body;

  if (!name) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле name не должно быть пустым' });
  }

  if (!link) {
    res
      .status(BAD_REQUEST)
      .send({ message: 'Поле link не должно быть пустым' });
  }

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const putCardLike = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true },
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
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

export const deleteCardLike = (req: Request, res: Response) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  if (!cardId) {
    res.status(BAD_REQUEST).send({ message: 'Не передан id карточки' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true, runValidators: true },
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
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
