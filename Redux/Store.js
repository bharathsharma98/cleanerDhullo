import { createStore, applyMiddleware } from "redux";
import { RootReducer } from "./RootReducer";
import { logger } from "redux-logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cleaner"],
};
const persistedReducer = persistReducer(persistConfig, RootReducer);

const middleware = [logger];
export const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware)
);
export const pesistedStore = persistStore(store);
