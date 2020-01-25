import { combineReducers } from "redux";
import { game } from "../game/reducer";
import { auth } from "../login/reducer";

export default combineReducers({
  auth,
  game
})
