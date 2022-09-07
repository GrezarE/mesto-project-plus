import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6317e18abc3dfef49e0183c8', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRouter);

const server = app.listen(PORT, () => {
  console.log('Started');
});
