import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './reducers/rootReducer';
import rootSaga from './utils/sagas';

const userTiming = () => (next) => (action) => {
  if (performance.mark === undefined) return next(action);
  performance.mark(`${action.type}_start`);
  const result = next(action);
  performance.mark(`${action.type}_end`);
  performance.measure(
    `${action.type}`,
    `${action.type}_start`,
    `${action.type}_end`,
  );
  return result;
}

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware, userTiming)));

sagaMiddleware.run(rootSaga);
