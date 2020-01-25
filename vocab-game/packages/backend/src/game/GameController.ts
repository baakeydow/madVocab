import User from '../authentication/models/user';
import Words from './models/words';
import TranslationService from './TranslationService';

export async function getCurrentLvl(uid: string) {
  return User.findOne({'_id': uid}).then((doc) => {
    return doc.get('lvl')
  }).catch(() => {
    return 1
  })
}

export async function updateLvl(uid: string, lvl: string) {
  return User.updateOne({'_id': uid}, {lvl})
}

export function getCurrentGameWords(uid: string) {
  return User.findOne({'_id': uid}).then((doc)=> {
    const toSkip = doc.get('lvl') === 0 ? 0 : Number(doc.get('lvl')) * 10;
    return Words.find()
    .skip(toSkip)
    .limit(10)
    .select('-_id')
  }).catch(() => {
    return []
  })
}

export async function getAvailableLevels() {
  return await Words.estimatedDocumentCount() / 10; // 10 words for each level
}

export async function initGameData() {
  const trService = new TranslationService();
  return await trService.indexWords()
}