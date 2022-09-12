import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../errors/index';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const userId = req.user._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      }

      const cardId = card?.owner.toString();
      if (cardId !== userId) {
        throw new ForbiddenError('Недостаточно прав');
      } else {
        Card.deleteOne({ _id: id })
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              const error = new BadRequestError(
                'Id карточки не прошло валидацию',
              );
              next(error);
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Id карточки не прошло валидацию');
        next(error);
      } else {
        next(err);
      }
    });
};

export const putCardLike = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Запрос на постановку лайка не прошел валидацию',
        );
        next(error);
      } else {
        next(err);
      }
    });
};

export const deleteCardLike = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError(
          'Запрос на постановку лайка не прошел валидацию',
        );
        next(error);
      } else {
        next(err);
      }
    });
};
