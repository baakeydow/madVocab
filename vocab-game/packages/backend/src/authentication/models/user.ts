import { NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  lvl: {
    type: Number,
    required: true,
    default: 0
  }
});

// authenticate input against database
UserSchema.statics.authenticate = (email: string, password: string, callback: (err: any, user?: any) => void) => {
  User.findOne({ email })
    .exec((err, user) => {
      if (err) {
        return callback(err)
      }
      if (!user) {
        const error = new Error('User not found.');
        return callback(error);
      }
      bcrypt.compare(password, user.get('password'), (decryptError, result) => {
        if (result === true) {
          return callback(null, user);
        }
        return callback(decryptError);
      })
    });
}

// hashing a password before saving it to the database
UserSchema.pre('save', function(next: NextFunction) {
  bcrypt.hash(this.get('password'), 10, (err: any, hash: any) => {
    if (err) {
      return next(err);
    }
    this.set('password', hash)
    next();
  })
});

const User = mongoose.model('User', UserSchema);

export default User;
