import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import errorHandler from './middlewares/errors';
import auth from './middlewares/auth';
import authRouter from './routes/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use('/', authRouter);

app.use(auth);

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
