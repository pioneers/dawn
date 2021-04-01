import { createStore, applyMiddleware, compose } from 'redux';
import { electronEnhancer } from 'redux-electron-store';

let enhancer = electronEnhanncer({
    dispatchProxy: action => store.dispatch(action),
});

const store = createStore(reducer, initialState, enhancer);
export default store;