import "../styles/globals.css";
// redux imports
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import 'bootstrap/dist/css/bootstrap.min.css';
import Head from "next/head";
// redux-persist imports

import user from '../reducers/user'
import menuChoice from "../reducers/menu";

const store = configureStore({
  reducer: { user, menuChoice },
});
function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      
      <Component {...pageProps} />
   </Provider>
  );
}

export default MyApp;

