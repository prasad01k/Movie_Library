import React from "react";
import {thunk} from "redux-thunk";
import {Provider} from "react-redux";
import {createBrowserHistory} from "history";
import { applyMiddleware, createStore } from "redux";
import {createRouterMiddleware, ReduxRouter} from "@lagunovsky/redux-react-router";

import rootReducer from "./Reducer";
import { setCurrentUser, setToken } from "./components/login/LoginActions";
import { isEmpty } from "./utils/Utils";

// const Root = ({children, initialState = {}})=>{
//     const history = createBrowserHistory();
//     const middleware = [thunk, createRouterMiddleware(history)];

//     const store = createStore(
//         rootReducer(history),
//         initialState,
//         applyMiddleware(...middleware)
//     );

//     return(
//         <Provider store={store}>
//             <ReduxRouter history={history}>{children}</ReduxRouter>
//         </Provider>
//     );
// };

// export default Root;

export default ({ children, initialState = {} }) => {
    const history = createBrowserHistory();
    const middleware = [thunk, createRouterMiddleware(history)];
  
    const store = createStore(
      rootReducer(history),
      initialState,
      applyMiddleware(...middleware)
    );
  
    // check localStorage
    if (!isEmpty(localStorage.getItem("token"))) {
      store.dispatch(setToken(localStorage.getItem("token")));
    }
    if (!isEmpty(localStorage.getItem("user"))) {
      const user = JSON.parse(localStorage.getItem("user"));
      store.dispatch(setCurrentUser(user, ""));
    }
  
    return (
      <Provider store={store}>
        <ReduxRouter history={history}>{children}</ReduxRouter>
      </Provider>
    );
  };