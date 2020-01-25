import { handleActions } from "redux-actions";
import {
    fetchUser,
    fetchUserFulfilled,
    fetchUserRejected,
    createUser,
    createUserFulfilled,
    createUserRejected
} from "./action";

import { getLoggedUser } from '../misc/utils';

export const auth = handleActions(
    {
        [fetchUser]: (state, { payload }) => {
            const newState = { ...state, fetching: true }
            return newState;
        },
        [fetchUserFulfilled]: (state, { payload }) => {
            sessionStorage.setItem('MadVocab-User', JSON.stringify(payload))
            return {
              ...state,
              fetching: false,
              fetched: true,
              error: null,
              logged_user: {
                uid: payload.uid,
                email: payload.email,
                username: payload.username,
                token: payload.token,
              }
            }
        },
        [fetchUserRejected]: (state, { payload }) => {
            sessionStorage.removeItem('MadVocab-User');
            return {
              ...state,
              fetching: false,
              error: payload,
              logged_user: {
                uid: null,
                email: null,
                username: null,
                token: null,
              }
            }
        },
        [createUser]: (state, { payload }) => {
          const newState = { ...state, fetching: true }
          return newState;
        },
        [createUserFulfilled]: (state, { payload }) => {
            sessionStorage.setItem('MadVocab-User', JSON.stringify(payload))
            return {
              ...state,
              fetching: false,
              fetched: true,
              error: null,
              logged_user: {
                uid: payload.uid,
                email: payload.email,
                username: payload.username,
                token: payload.token
              }
            }
        },
        [createUserRejected]: (state, { payload }) => {
            sessionStorage.removeItem('MadVocab-User');
            return {
              ...state,
              fetching: false,
              error: payload,
              logged_user: {
                uid: null,
                email: null,
                username: null,
                token: null
              }
            }
        }
    },
    {
      logged_user: getLoggedUser(),
      fetching: false,
      fetched: false,
      error: null
    }
);
