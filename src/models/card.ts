import mongoose from 'mongoose';
import { IUser } from './user';
import isURL from 'validator/lib/isURL';

const User = mongoose.model('user');

interface ICard {
  name: string;
  link: string;
  owner: IUser;
  likes: [];
  createdAt: Date;
}

const CardShema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'must be valid url',
    },
  },
  owner: { User, required: true },
  likes: [{ User, default: [] }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', CardShema);
