import { handleActions } from "redux-actions";
import {
  getLvls,
  getLvlsFulfilled,
  getLvlsRejected,
  getGame,
  getGameFulfilled,
  getGameRejected
} from "./actions";

export const game = handleActions(
  {
    [getLvls]: (state, { payload }) => {
      const newState = { ...state, fetching: true }
      return newState;
    },
    [getLvlsFulfilled]: (state, { payload }) => {
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        lvls: payload.data
      }
    },
    [getLvlsRejected]: (state, { payload }) => {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: payload,
        lvls: []
      }
    },
    [getGame]: (state, { payload }) => {
      const newState = { ...state, fetching: true }
      return newState;
    },
    [getGameFulfilled]: (state, { payload }) => {
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: null,
        current_game: payload.data
      }
    },
    [getGameRejected]: (state, { payload }) => {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: payload,
        current_game: {
          lvl: 0,
          words: []
        }
      }
    }
  },
  {
    lvls: [],
    current_game: {
      lvl: 0,
      words: []
    },
    fetching: false,
    fetched: false,
    error: null,
  }
);
