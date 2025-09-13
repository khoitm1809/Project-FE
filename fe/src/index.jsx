import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
       <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
    </React.StrictMode>
);

