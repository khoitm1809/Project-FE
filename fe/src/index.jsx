import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app/app';
import { BrowserRouter as Router } from 'react-router-dom';
import store, { persistor } from './store';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "./locales/i18n"
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <App />
                </Router>
            </PersistGate>
        </Provider>
    </LocalizationProvider>
    // </React.StrictMode>
);

