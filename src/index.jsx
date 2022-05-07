import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { store } from './store'
import { Provider } from 'react-redux'
import Normalize from 'react-normalize';
import './sass/index.scss'
import './index.css'
import { createStore } from 'redux';
import { userReducer } from './store/reducer';
const root = ReactDOM.createRoot(document.getElementById('root'));
export const store = createStore(userReducer);
root.render(
    <Provider store={store}>
      <Normalize />
         <App /> 
    </Provider>
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals