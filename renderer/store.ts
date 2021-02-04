import { compose, createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './reducers/rootReducer';
import rootSaga from './utils/sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

const middlewares = [sagaMiddleware];
const middlewareEnhancer = applyMiddleware(...middlewares);

const enhancers = [middlewareEnhancer];
const composedEnhancers = compose(...enhancers);

export const store = createStore(
  rootReducer,
  undefined,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);
