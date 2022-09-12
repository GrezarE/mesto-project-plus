import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  getUserById,
  patchUser,
  patchAvatar,
  getMe,
} from '../controllers/users';
import { checkUrl, checkId } from '../utiles/utiles';

const router = Router();

router.get('/', getUsers);

router.get('/me', getMe);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().custom(checkId),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  patchUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(checkUrl),
    }),
  }),
  patchAvatar,
);

export default router;
