import mongoose, { Schema } from 'mongoose';
import isURL from 'validator/lib/isURL';
import User from './user';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
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
      // validator: (v: string) => isURL(v),
      // message: 'must be valid url',
      validator: (v: string) =>
        /^(https?:\/\/)(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(
          v
        ),
      message: 'must be valid url',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: User, default: [] }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', CardShema);
