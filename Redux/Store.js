 import { createStore, applyMiddleware } from "redux";
 import { RootReducer } from "./RootReducer";
 import { logger } from "redux-logger";

  const middleware = [logger];
 const store = createStore(RootReducer,applyMiddleware(...middleware));

 export default store;