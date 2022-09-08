import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  patchUser,
  patchAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);

router.post('/', createUser);

router.get('/:userId', getUserById);

router.patch('/me', patchUser);

router.patch('/me/avatar', patchAvatar);

export default router;
