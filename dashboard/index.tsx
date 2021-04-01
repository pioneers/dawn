import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
    (<Provider store={store}>
        <Dashboard testing={true}/>
    </Provider>),
    document.getElementById("react-content")
);
