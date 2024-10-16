import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { Prodiver } from "react-redux";
import "antd/dist/reset.css";
// import { applyMiddleware, createStore } from "redux";
// import promiseMiddleware from 'redux-promise'
// import ReduxThunk from 'redux-thunk'

// const createStorewithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Prodiver store={}> */}
    <App />
    {/* </Prodiver> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
