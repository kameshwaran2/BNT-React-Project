import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Front from "./Front.jsx";

import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import Reducers from "./reducer/index.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const store = createStore(Reducers, compose(applyMiddleware(thunk))); //Redux advance concept

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
