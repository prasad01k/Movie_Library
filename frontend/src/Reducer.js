import {combineReducers} from "redux";
import {createRouterReducer} from "@lagunovsky/redux-react-router";
import { signupReducer } from "./components/signup/SignupReducer";
import { loginReducer } from "./components/login/LoginReducer";


const createRootReducer = history =>
    combineReducers({
        router: createRouterReducer(history),
        createUser: signupReducer,
        auth: loginReducer
    });

export default createRootReducer;