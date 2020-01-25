import mongoose from 'mongoose';

interface WordModel extends mongoose.Document {
  french: string;
  english: string;
}

const WordSchema = new mongoose.Schema({
  french: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  english: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

const Words = mongoose.model<WordModel>('Words', WordSchema, 'madvocabgame', true);

export default Words;