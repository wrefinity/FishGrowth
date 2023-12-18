import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import { store } from "./redux/store"
import { CookiesProvider } from "react-cookie";
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
  <CookiesProvider>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </CookiesProvider>
</Provider>
  ,
  document.getElementById('root')
)