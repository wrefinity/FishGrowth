import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";
import Nav from "./components/Nav";
import Layout from "../src/components/layout"
import Prediction from "../src/components/Prediction"
import PredictionList from "../src/components/PredictionList";
import UserList from "../src/components/UserList";
import Home from "../src/components/Home"
import About from "./components/About";

function App() {
  return (
    <div>
      <Nav />
      <ToastContainer />
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/prediction" element={<PredictionList />} />
            <Route path="/users" element={<UserList />} />
          </Route>
        </Routes>

      </ScrollToTop>
    </div>
  );



}

const ProtectUserRoute = ({ children }) => {
  const [cookies] = useCookies();
  const user = cookies.user;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectAdminRoute = ({ children }) => {
  const [cookies] = useCookies();
  const user = cookies.user;
  if (!user) {
    return <Navigate to="/" replace />;
  } else if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PreventMultipleLogin = ({ children }) => {
  const [cookies] = useCookies();
  const user = cookies.user;
  if (user) {
    return <Navigate to="/shop" replace />;
  } else {
    return children;
  }
};

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return children;
};

export default App;