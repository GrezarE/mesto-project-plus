import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { createUser, loginUser } from '../controllers/users';

const router = Router();

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string(),
    }),
  }),
  createUser
);

router.post(
  '/singin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser
);

export default router;
