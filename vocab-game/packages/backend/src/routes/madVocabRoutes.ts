import express, { Request, Response, NextFunction } from 'express';
import { UserError } from '../authentication/services/authService';
import { getAvailableLevels, getCurrentLvl, getCurrentGameWords, initGameData, updateLvl } from '../game/GameController';

const router = express.Router();

router.get('/all-levels', (req: Request, res: Response, next: NextFunction) => {
  getAvailableLevels().then((lvls) => {
    if (!lvls) initGameData()
    res.json({data: lvls})
  })
});

router.get('/current-game', (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.query
  getCurrentGameWords(uid).then(async (dict) => {
    res.json({data: {
      words: dict,
      lvl: await getCurrentLvl(uid)
    }})
  })
});

router.get('/select-level', (req: Request, res: Response, next: NextFunction) => {
  const { uid, lvl } = req.query
  updateLvl(uid, lvl).then(() => {
    getCurrentGameWords(uid).then(async (dict) => {
      res.json({data: {
        words: dict,
        lvl: await getCurrentLvl(uid)
      }})
    })
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
