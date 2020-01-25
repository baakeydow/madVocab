import express, { Request, Response, NextFunction } from 'express';
import AuthService, { UserError } from '../authentication/services/authService';

const authsvc = new AuthService()
const router = express.Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const { email, passwd } = req.body?.data
  if (email && passwd) {
    authsvc.getAuthObject(email, passwd).then((authObject) => {
      res.json(authObject)
    }).catch((err) => {
      console.log(err)
      next(err);
    })
  } else {
    const err = new Error() as UserError;
    err.message = 'All fields are required.';
    err.status = 400;
    return next(err)
  }
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  authsvc.registerUser(req.body?.data).then((result: any) => {
    authsvc.getAuthObject(result.email, result.password).then((authObject) => {
      res.json(authObject)
    }).catch((err) => {
      console.log(err)
      next(err);
    })
  }).catch((err: UserError) => {
    console.log(`[INFO] Failed to create user ! ${err}`);
    next(err)
  }) 
});

// error handler
// define as the last router.use callback
router.use((err: UserError, req: Request, res: Response, next: NextFunction) => {
  if (!err.status || err.status === 500) {
    console.log('ALERT ALERT that\'s a 500 ==========================================');
    console.log(err);
    console.log('====================================================================');
  }
  res.status(err.status || 500);
  res.send(err);
});

export default router;
