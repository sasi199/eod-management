import { configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage";
import {combineReducers} from "redux";
import trainerReducer from './TrainerRedux';

const persistConfig = {
    key:"root",
    storage
};

const rootReducer = combineReducers({
    trainer: persistReducer(persistConfig, trainerReducer)
});

const store = configureStore({reducer:rootReducer});

const persistor = persistStore(store);

export {store, persistor};