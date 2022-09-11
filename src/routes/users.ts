import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  createUser,
  getUserById,
  patchUser,
  patchAvatar,
  loginUser,
  getMe,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.get('/me', getMe);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }),
  getUserById
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  patchUser
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }),
  }),
  patchAvatar
);


export default router;
