import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

export const UserShema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'must be valid url',
    },
    required: true,
  },
});

export default mongoose.model<IUser>('User', UserShema);
