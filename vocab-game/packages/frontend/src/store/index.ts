import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const middlewares = [thunk];
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 10 });

const enhancer =
  process.env.NODE_ENV !== "production"
    ? composeEnhancers(applyMiddleware(...middlewares))
    : compose(applyMiddleware(...middlewares));

const store = createStore(rootReducer, /** initial state, */ enhancer);

export default store;
