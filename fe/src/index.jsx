import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </LocalizationProvider>
    // </React.StrictMode>
);

