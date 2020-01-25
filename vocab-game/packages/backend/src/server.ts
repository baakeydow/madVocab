
import http from 'http';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import AuthService, { UserError } from './authentication/services/authService';
import { initGameData } from './game/GameController';
import authRoutes from './routes/authRoutes';
import madVocabRoutes from './routes/madVocabRoutes';
import StorageService from './storage/StorageService';
import settings from './.settings.json';

const storage = new StorageService(settings.mongodb);
const authsvc = new AuthService()

const server = express();
dotenv.config()

const jwtFilter = (req: Request, res: Response, next: NextFunction) => {
  authsvc.isLegitToken(req.header('authorization'), req.header('user')).then(() => {
    next()
  }).catch(() => {
    const err = new Error() as UserError;
    err.message = 'You are Unauthorized !!!';
    err.status = 401;
    next(err);
  })
};

// use express-session with mongodb to manage data
server.use(storage.getSession());
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(helmet());
server.disable('x-powered-by');

server.use('/api/user/', authRoutes)
server.use('/api/*', jwtFilter)
server.use('/api/madvocab/', madVocabRoutes)
server.get('/hello', (req, res) => res.send('Hello MadWorld !!! Dopeness !!!'));

server.use(express.static(path.join(__dirname, '../../build/front-dist')));
server.use('*', express.static(path.join(__dirname, '../../build/front-dist/index.html')));

initGameData();

http.createServer(server).listen(9999, () => {
  console.log(`[INFO] MadVocab\'API is running in ${process.env.NODE_ENV} mode on port :9999 !\n\n\n\n`);
});