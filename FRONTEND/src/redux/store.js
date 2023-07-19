import reducer from './reducer';
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
import  thunkMiddleware from 'redux-thunk';

const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhacers(applyMiddleware(thunkMiddleware)));

export default store;