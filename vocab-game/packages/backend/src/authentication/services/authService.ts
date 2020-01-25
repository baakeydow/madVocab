import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export interface UserError extends Error {
  status?: number
}

interface UserCreationProps {
  username: string
  email: string
  passwd: string
  passwdConf: string
}

export default class AuthService {
  protected privateKey: string;
  protected publicKey: string;

  constructor() {
    this.privateKey = fs.readFileSync(path.resolve(__dirname, '../keys/jwtRS256.key'), 'utf8');
    this.publicKey = fs.readFileSync(path.resolve(__dirname, '../keys/jwtRS256.key.pub'), 'utf8');
  }

  isLegitToken(token: string, uid: string) {
    return new Promise((resolve, reject) => {
      if (!token || !uid) reject(false);
      const verifyOptions = {
        issuer:  'Doftom',
        subject:  '21times2',
        audience:  String(uid),
        expiresIn:  "12h",
        algorithm:  "RS256"
      };
      try {
        const result = jwt.verify(token, this.publicKey, verifyOptions)
        if (result) {
          const data = jwt.decode(token, {complete: true});
          if (data && data.payload?.id === uid) {
            return this.getAuthObject(data.payload.email, data.payload.pwd).then(() => {
              resolve(true)
            }).catch(() => {
              reject(false);
            })
          }
          reject(false);
        }
      } catch (error) {
        console.log(error)
      }
      reject(false);
    })
  }

  getAuthObject(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.login(email, password).then((user: any) => {
        const signOptions = {
          issuer: 'Doftom',
          subject: '21times2',
          audience: String(user._id),
          expiresIn: "12h",
          algorithm: "RS256"
        };
        const authObject = {
          uid: user._id,
          email: user.email,
          username: user.username,
          token: jwt.sign({ email, id: user._id, pwd: password }, this.privateKey, signOptions),
        }
        resolve(authObject);
      }).catch((error) => {
        reject(error)
      })
    });
  }

  private login(email: string, password: string) {
    const err = new Error() as UserError;
    err.status = 400;
    return new Promise((resolve, reject) => {
      if (email && password) {
        User.schema.statics.authenticate(email, password, (error, user) => {
          if (error || !user) {
            err.message = 'Wrong email or password.';
            err.status = 401;
            reject(err);
          }
          resolve(user);
        });
      } else {
        err.message = 'All fields required.';
        reject(err);
      }
    });
  }

  private userExist(keyValue: object) {
    return new Promise((resolve, reject) => {
      User.findOne(keyValue)
        .exec((err: any, user: any) => {
          if (!err && user) {
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  registerUser(user: UserCreationProps) {
    const err = new Error() as UserError;
    err.status = 400;
    return new Promise((resolve, reject) => {
      // confirm that user typed same password twice
      if (user.passwd !== user.passwdConf) {
        err.message = 'Passwords do not match.';
        reject(err);
      } else if (user.email && user.username &&
        user.passwd && user.passwdConf) {
        const userData = {
          email: user.email,
          username: user.username,
          password: user.passwd,
          lvl: 0
        }
        this.userExist({ email: userData.email }).then(() => {
          err.message = 'email already taken';
          reject(err);
        }).catch(() => {
          this.userExist({ username: userData.username }).then(() => {
            err.message = 'username already taken';
            reject(err);
          }).catch(() => {
            User.create(userData, (error: any, validUser: any) => {
              if (error) return reject(error)
              resolve(userData);
            });
          });
        });
      } else {
        err.message = 'User object is not valid';
        reject(err);
      }
    });
  }

}