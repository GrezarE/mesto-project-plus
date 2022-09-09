import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

export const UserShema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'must be valid url',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // select: false
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'must be valid url',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

UserShema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).then((user: IUser) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
    });
  }
);

export default mongoose.model<IUser, UserModel>('User', UserShema);
