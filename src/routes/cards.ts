import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCard);

router.put('/:cardId/likes', putCardLike);

router.delete('/:cardId/likes', deleteCardLike);

export default router;
