import axios from "axios"
import Settings from "../models/Settings"
import { createAction } from "redux-actions"
import { getAuthHeaders } from "../misc/utils"

const getGameEnpoints = (ep: string) => {
  if (['all-levels', 'current-game', 'select-level'].includes(ep)) {
    return Settings.getAPI(`/api/madvocab/${ep}`);
  }
  return Settings.getAPI('/api/madvocab/');
}

const logoutOn401 = (err: string | any) => {
  if ((typeof err === 'string' && err.includes('401')) || err?.code === 401 || err?.message?.includes('401')) {
    sessionStorage.removeItem('MadVocab-User');
    window.location.reload()
  }
}

export const getLvls = createAction("GET_LVLS");
export const getLvlsFulfilled = createAction("GET_LVLS_FULFILLED");
export const getLvlsRejected = createAction("GET_LVLS_REJECTED")

export function getGameLevels() {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(getLvls);
      const url = getGameEnpoints('all-levels');
      axios({
        url,
        method: 'get',
        headers: getAuthHeaders(false)
      }).then((response) => {
        dispatch(getLvlsFulfilled(response.data));
        resolve()
      }).catch((err) => {
        console.log('ERROR! : ', err);
        dispatch(getLvlsRejected(err));
        logoutOn401(err)
        reject()
      })
    })
  }
}

export const getGame = createAction("GET_GAME");
export const getGameFulfilled = createAction("GET_GAME_FULFILLED");
export const getGameRejected = createAction("GET_GAME_REJECTED")

export function getGameWords(userId: string) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(getGame);
      const url = getGameEnpoints('current-game');
      axios({
        url,
        method: 'get',
        headers: getAuthHeaders(false),
        params: {
          uid: userId
        }
      }).then((response) => {
        dispatch(getGameFulfilled(response.data));
        resolve()
      }).catch((err) => {
        console.log('ERROR! : ', err);
        dispatch(getGameRejected(err));
        logoutOn401(err)
        reject()
      })
    })
  }
}

export function getNextLevel(userId: string, currentLvl: number) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(getGame);
      const url = getGameEnpoints('select-level');
      axios({
        url,
        method: 'get',
        headers: getAuthHeaders(false),
        params: {
          uid: userId,
          lvl: currentLvl + 1
        }
      }).then((response) => {
        dispatch(getGameFulfilled(response.data));
        resolve()
      }).catch((err) => {
        console.log('ERROR! : ', err);
        dispatch(getGameRejected(err));
        logoutOn401(err)
        reject()
      })
    })
  }
}