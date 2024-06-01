import React, { Component } from "react";
import Root from "./Root";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import requireAuth from "./utils/RequireAuth";
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000";


const AuthRequired = requireAuth(Dashboard);


class App extends Component {
  render() {
    return (
      <div>
        <Root>
          <Routes>
            <Route path="/dashboard" element={<AuthRequired/>} />
            <Route path="*">Ups</Route>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route exact path="/" element={<Home/>} />
          </Routes>
        </Root>
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
      </div>
    );
  }
}

export default App; 