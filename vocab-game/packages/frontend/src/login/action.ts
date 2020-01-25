import axios from 'axios';
import { createAction } from "redux-actions";
import Settings from "../models/Settings";

const getUserEnpoints = (ep: string) => {
  if (['login', 'register'].includes(ep)) {
    return Settings.getAPI(`/api/user/${ep}`);
  }
  return Settings.getAPI('/api/user/');
}

export const fetchUser = createAction("FETCH_USER");
export const fetchUserFulfilled = createAction("FETCH_USER_FULFILLED");
export const fetchUserRejected = createAction("FETCH_USER_REJECTED");

export function getCred(data) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(fetchUser);
      const url = getUserEnpoints('login');
      axios({
        url,
        data,
        method: 'post',
      }).then((response) => {
        dispatch(fetchUserFulfilled({
          uid: response.data.uid,
          email: response.data.email,
          username: response.data.username,
          token: response.data.token,
          lvl: response.data.lvl
        }));
        resolve()
      }).catch((err) => {
        dispatch(fetchUserRejected(err));
        console.log('ERROR! : ', err);
        reject(err)
      })
    })
  }
}

export const createUser = createAction("CREATE_USER");
export const createUserFulfilled = createAction("CREATE_USER_FULFILLED");
export const createUserRejected = createAction("CREATE_USER_REJECTED");

export function createCred(data) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(createUser);
      const url = getUserEnpoints('register');
      axios({
        url,
        data,
        method: 'post',
      }).then((response) => {
        dispatch(createUserFulfilled({
          uid: response.data.uid,
          email: response.data.email,
          username: response.data.username,
          token: response.data.token,
          lvl: response.data.lvl
        }));
        resolve()
      }).catch((err) => {
        dispatch(createUserRejected(err));
        console.log('ERROR! : ', err);
        reject(err)
      })
    })
  }
}