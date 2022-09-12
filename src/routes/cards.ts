import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { checkUrl, checkId } from '../utiles/utiles';
import {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(checkUrl),
    }),
  }),
  createCard,
);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().custom(checkId),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(checkId),
    }),
  }),
  putCardLike,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().custom(checkId),
    }),
  }),
  deleteCardLike,
);

export default router;
