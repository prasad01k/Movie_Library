import React, { Component } from "react";
import Root from "./Root";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";

class App extends Component {
  render() {
    return (
      <div>
        <Root>
          <Routes>
            <Route path="*">Ups</Route>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route exact path="/" element={<Home/>} />
          </Routes>
        </Root>
      </div>
    );
  }
}

export default App; 