import axios from "../../src/redux/Axioss";

// set config
const setConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// axios getter
const axioGet = async (route) => {
  return await axios.get(route);
};
const axioGetHeader = async (route, token) => {
  return await axios.get(route, setConfig(token));
};

// axios creators
const axioPost = async (route, credentials) => {
  return await axios.post(route, credentials);
};
const axioPostHeader = async (route, credentials, token) => {
  return await axios.post(route, credentials, setConfig(token));
};

// axios update
const axioPatch = async (route, credentials) => {
  return await axios.patch(route, credentials);
};
const axioPatchHeader = async (route, credentials, token) => {
  return await axios.patch(route, credentials, setConfig(token));
};

// axios delete
const axioDelete = async (route) => {
  return await axios.delete(route);
};
const axioDeleteHeader = async (route, token) => {
  return await axios.delete(route, setConfig(token));
};

const getToken = (ThunkAPI) => {
  return (
    ThunkAPI.getState().auth.user.token ??
    JSON.parse(localStorage.getItem("user")).token
  );
};

const requestHandler = {
  axioDeleteHeader,
  axioGet,
  axioGetHeader,
  axioPost,
  axioPostHeader,
  axioPatch,
  axioPatchHeader,
  axioDelete,
  getToken,
};

export default requestHandler;