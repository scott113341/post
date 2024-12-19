import React from "react";
import ReactDOM from "react-dom";

import createStore from "./store/create-store";
import AppContainer from "./containers/AppContainer";

ReactDOM.render(
  <AppContainer store={createStore()} />,
  document.getElementById("root"),
);
