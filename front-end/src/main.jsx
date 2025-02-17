import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

import App from "./App.jsx";
import "./index.css";
import theme from "./theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </CssVarsProvider>
    </Provider>
);
