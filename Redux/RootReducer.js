import { combineReducers } from "redux";
import { CleanerReducer } from "./Reducers/CleanerReducer";

export const RootReducer = combineReducers({ cleaner:  CleanerReducer });
