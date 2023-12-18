import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import decode from "jwt-decode";
import { validateEmpty, handleInput} from "../utills/InputHelpers";
import { reseter, login } from "../slicer/Auth";

const Home = () => {
  const { user, status, message } = useSelector((state) => state.auth);
  const [loginData, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signupData, setSignup] = useState({
    email: "test1@test.com",
    fullname: "test test",
    username: "test1",
    password: "pass1234",
    phone: "080484724792",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [sucessMessage, setSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const referal = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/predict";


  const redirector = () => {
    navigate(from, { replace: true });
  };

  const reset = () => {
    setLogin({
      username: "",
      password: "",
    });
  };
  const resetSign = () => {
    setSignup({
      email: "",
      fullname: "",
      username: "",
      password: "",
      phone: "",
    });
  };

  const displayErrorMessage = (message, color) => {
    setErrorMessage({ message, color });
  };

  useEffect(() => {
    referal.current();
  }, [formErrors, status, message, navigate, dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    setFormErrors(validateEmpty(loginData));
    setIsSubmit(true);
  };

  const dispatchLogin = () => {
    setSuccess('')
    if (Object.keys(formErrors).length === 0 && isSubmit ) {
      dispatch(reseter());
      
      dispatch(login(loginData));
      setIsSubmit(false);
    }

    if (status === "succeeded" || user) {
      displayErrorMessage('login sucess', 'green')
      dispatch(reseter());
      reset();
      redirector();
    }
    if (status === "failed") {
      dispatch(reseter());
      displayErrorMessage('Success message', 'red')
      setIsSubmit(false);
    }
  }
  referal.current = dispatchLogin;

  const token = JSON.parse(localStorage.getItem("user"))?.token?.access_token;
  if (token) {
    const decodedToken = decode(token);
    if (decodedToken.exp * 1000 > new Date().getTime())
      navigate("/predict");
  } 
 

  const handleSignup = async (e) => {
    e.preventDefault();
  

    try {
      // console.log()
      setSuccess('')
      if ( Object.keys(validateEmpty(signupData)).length === 0){
        const response = await fetch('http://localhost:8000/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });
  
        if (response.ok) {
          resetSign();
          setSuccess("user registered")
        }
      }else{
        setSuccess("all field required")
        console.error("data not send")
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <>
      <div className="container-fluid w-100">

        {!token && (
          <div className="row">
            <div className="col-md-6 col-12 p-0 d-block d-md-block col-">
              <div className="bg"></div>
            </div>
            <div className="col-md-6 col-12 p-0">
              <div className="row">
                <div className="col-6 p-0">
                  <div className="bg-3"></div>
                </div>
                <div className="col-6 p-0">
                  <div className="bg-6"></div>
                </div>
                <div className="col-6 p-0">
                  <div className="bg-5"></div>
                </div>
                <div className="col-6 p-0">
                  <div className="bg-4"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container d-block d-sm-none d-md-block d-lg-none d-xl-block" style={{ marginLeft: '5%', marginTop: '-10%', position: 'relative' }}>
        <div className="offcanvas offcanvas-end" id="demo">
          <div className="offcanvas-header">
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>
          <div className="offcanvas-body">
            <h1 className="offcanvas-title">Login</h1>
            <div>
              <form id="loginForm" onSubmit={handleLogin} style={{ marginTop: '3.5%', marginLeft: '-3%', width: '90%', height: '20vh', borderRadius: '8px' }}>
                <div className="mb-3 mt-3">
                  {errorMessage && (
                    <div style={{ color: errorMessage.color, padding: '10px', border: `1px solid ${errorMessage.color}`, borderRadius: '5px' }}>
                      {errorMessage.message}
                    </div>
                  )}
                </div>
                <div className="mb-3 mt-3">
                  <input 
                  type="text" 
                  className="form-control" 
                  id="usernamex" 
                  placeholder="Enter your username"
                  name="username" 
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }}
                  value={loginData.username}
                  onChange={(e) => handleInput(e, setLogin)} 
                  />
                </div>
                <div className="mb-3">
                  <input 
                  type="password" 
                  className="form-control"
                  id="password"
                  placeholder="enter password"
                  name="password" 
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }}
                  value={loginData.password}
                  onChange={(e) => handleInput(e, setLogin)}
                  />
                </div>
                <button type="submit" className="btn btn-primary fff">Login</button>
              </form>
            </div>
          </div>
        </div>
        <button className="btn btn-info w-45" data-bs-toggle="offcanvas" data-bs-target="#demo">Login</button>
      </div>

      <div className="container d-block d-sm-none d-md-block d-lg-none d-xl-block col-12" style={{ marginTop: '-2.7%', marginLeft: '15%', position: 'relative' }}>
        <div className="offcanvas offcanvas-end" id="dem">
          <div className="offcanvas-header">
            <h1 className="offcanvas-title">Sign up</h1>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" style={{ marginLeft: '-30%' }}></button>
          </div>
          <div className="offcanvas-body">
            <div>
              <form id="signupForm" onSubmit={handleSignup} style={{ marginTop: '3.5%', marginLeft: '-3%', width: '90%', height: '20vh', borderRadius: '8px' }}>
                
                {sucessMessage && (
                  <p className={{color:"green"}}> {sucessMessage} </p>
                )}
                <div className="mb-3 mt-3">
                  <input 
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter farmer fullname"
                  name="fullname"  
                  value={signupData.fullname}
                  onChange={(e) => handleInput(e, setSignup)}
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }} /><br />

                  <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="username"  
                  value={signupData.username}
                  onChange={(e) => handleInput(e, setSignup)} 
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }} 
                  /><br />
                  <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  name="email"
                  value={signupData.email}
                  onChange={(e) => handleInput(e, setSignup)} 
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }} />
                </div>
                <div className="mb-3">
                  <input 
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={signupData.phone}
                  onChange={(e) => handleInput(e, setSignup)}
                  placeholder="Enter phone number"
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }} /><br />
                  <input
                  type="password"
                  className="form-control" 
                  id="pword"
                  placeholder="Enter password"
                  name="password"
                  value={signupData.password}
                  onChange={(e) => handleInput(e, setSignup)} 
                  style={{ border: '3px solid rgba(0, 0, 0, 0.322)' }} /><br />
                </div>
                <button type="submit" className="btn btn-primary fff">SIGN UP</button>
              </form>
            </div>
          </div>
        </div>
        <button className="btn btn-info" data-bs-toggle="offcanvas" data-bs-target="#dem" style={{ fontWeight: 'bold' }}>Sign up</button>
      </div>
    </>
  );
};

export default Home;
