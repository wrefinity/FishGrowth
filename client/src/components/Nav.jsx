import React, { useEffect }  from 'react';
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import decode from "jwt-decode";
import { toast } from "react-toastify";

// # custome function 
import logo from "../assets/images/logo_UL.png";
import { setLogout, getUser } from "../slicer/Auth"
import { getUsers, reseter as resetUsers } from "../slicer/UserSlice";
import { getPrediction, reseter as ResetPrediction } from "../slicer/Prediction";

const Nav = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate()
    const { user } = useSelector(getUser);

    const token = user?.token?.access_token;
  
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        // toast.error("Token expired, please login", { autoClose: 4000 });
        dispatch(setLogout());
        <Navigate to="/" state={{ from: location }} replace />;
  
      }
    }
    
    
    useEffect(() => {
        dispatch(getPrediction());
        dispatch(ResetPrediction())
        const roler = process.env.REACT_APP_ROLER
        if (
          user?.fullname === roler||
          user?.role === roler
        ) {
    
          dispatch(getUsers());
          dispatch(resetUsers());
        }    
      }, [dispatch]);

    // if (token) {
    //     return <Navigate to="/predict" replace />;
    // }

  return (
    <>
          <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
        <div className="container-fluid">
            <a className="navbar-brand ml-5">
                <img src={logo} style={{width: "100px"}}/>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavbar" style={{marginLeft: "50%", fontSize: "120%", fontWeight: "bold", textTransform: "capitalize"}}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a href="/" className="nav-link">Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="/about" className="nav-link">About</a>
                    </li>
                    {user && (
                        <>
                            <li className="nav-item">
                                <a href="/predict" className="nav-link">Predict</a>
                            </li>
                    
                            <li className="nav-item">
                                <a href="/prediction" className="nav-link">Predictions</a>
                            </li>
                        </>
                    )}

                    {user?.user?.username === "admin"  ? (
             
                        <li className="nav-item">
                            <a href="/users" className="nav-link">Users</a>
                        </li>
                    ): ""}
           
                    <li className="nav-item">
                        <a href="/use" className="nav-link">How to use the system</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    </>
  )
}

export default Nav
