import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import LangConfig from "./lang/LangConfig";
import { RouterProvider } from "react-router-dom";
import store from "./core/redux/store/store";
import router from "./router/router";
import PagePreloaderLoader from "./shared/components/loader/PagePreloader";
import "./index.scss";

import global from "global";
import * as process from "process";
// import { GoogleOAuthProvider } from "@react-oauth/google";
global.process = process;

const langData = LangConfig.getLangConfig();
const CLIENT_ID =
  "608984726176-cmpbo34sp4n5upejl2ueb10luqacpg7l.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IntlProvider
      locale={langData.lang}
      defaultLocale="en"
      messages={langData.messages}
    >
      <Provider store={store}>
        <React.Suspense fallback={<PagePreloaderLoader active={true} />}>
          {/* <GoogleOAuthProvider clientId={CLIENT_ID}> */}
            {/* <BootstrapToastsProvider
            toastContainerProps={{ position: "top-end", className: "p-2" }}
          > */}
            <RouterProvider router={router}></RouterProvider>
          {/* </GoogleOAuthProvider> */}
          {/* </BootstrapToastsProvider> */}
        </React.Suspense>
      </Provider>
    </IntlProvider>
  </React.StrictMode>
);
