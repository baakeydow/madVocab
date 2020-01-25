import fs from 'fs';
import path from 'path';
import readline from 'readline';
import AWS from 'aws-sdk';
import Words from './models/words';

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default class TranslationService {
  protected awsTranslate: AWS.Translate;
  protected rl: readline.Interface;

  constructor() {
    this.awsTranslate = new AWS.Translate({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-west-3'
    });
    this.rl = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'verbe.txt')),
        terminal: false
    });
  }
  
  private translate(sourceText: string) {
    const params = {
      SourceLanguageCode: 'fr',
      TargetLanguageCode: 'en',
      Text: sourceText,
    };
    return new Promise((resolve, reject) => {
      this.awsTranslate.translateText(params, (err, data) => {
        if (err) {
          reject(err);
        };
        resolve(data?.TranslatedText);
      });
    })
  }
  
  public async indexWords() {
    let bulkOps = [];
    for await (const line of this.rl) {
      if (line && await Words.estimatedDocumentCount() < 500) {
        bulkOps.push(
          {
            updateOne: {
              filter: { french: line },
              upsert: true,
              update: {
                french: line,
                english: await this.translate(line)
              }
            }
          }
        )
        if (bulkOps.length === 100) {
          Words.bulkWrite(shuffle(bulkOps)).then(res => {
            console.log(res.upsertedCount, res.modifiedCount, res.deletedCount);
          });
          bulkOps = [];
        }
      } else {
        bulkOps = [];
      }
    }
    if (bulkOps.length) {
      Words.bulkWrite(shuffle(bulkOps)).then(res => {
        console.log(res.upsertedCount, res.modifiedCount, res.deletedCount);
      });
    }
  }
}