import { Router } from 'express';
import { getUsers, createUser, getUserById } from '../controllers/users';

const router = Router();

router.get('/users', getUsers);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

export default router;
