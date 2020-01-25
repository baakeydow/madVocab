import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo'; 

const MongoStore = connectMongo(session);

interface Configuration {
  mongoUrl: string
  mongoSecret: string
}

export default class StorageService {

  protected configuration: Configuration;

  constructor(configuration: Configuration) {
      this.configuration = configuration;
  }

  private getMongooseConnection(dbName: string) {
    mongoose.Promise = global.Promise;
    mongoose.connect(`${this.configuration.mongoUrl}/${dbName}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).catch(() => {
      console.error(`[ERROR] API failed to connect to ${this.configuration.mongoUrl}/${dbName}`)
      process.exit()
    });
    mongoose.connection.once('open', () => {
      // Connected !
      console.log(`[INFO] API connected to ${this.configuration.mongoUrl}/${dbName}`);
    });
    return mongoose.connection;
  }

  public getSession() {
    return session({
      secret: this.configuration.mongoSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: new MongoStore({
        mongooseConnection: this.getMongooseConnection('MadVocab-users')
      })
    })
  }
}