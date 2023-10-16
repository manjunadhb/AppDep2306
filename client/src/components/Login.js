import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

function Login() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    axios.defaults.baseURL = "";
    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("token");
    emailInputRef.current.value = localStorage.getItem("email");
    passwordInputRef.current.value = localStorage.getItem("password");
    //validateCredentials();
    // validateToken();
  }, []);

  let validateCredentials = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "http://localhost:1234/validateLogin",
      reqOptions
    );

    let JSOData = await JSONData.json();

    if (JSOData.status == "success") {
      console.log(JSOData);
      // localStorage.setItem("email", emailInputRef.current.value);
      // localStorage.setItem("password", passwordInputRef.current.value);
      localStorage.setItem("token", JSOData.token);
      navigate("/home", { state: JSOData });
    } else {
      alert(JSOData.msg);
    }
  };

  let validateCredentialsThruAxios = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);

    let response = await axios.post("/validateLogin", dataToSend);

    console.log(response);

    if (response.data.status == "success") {
      console.log(response.data);
      // localStorage.setItem("email", emailInputRef.current.value);
      // localStorage.setItem("password", passwordInputRef.current.value);
      localStorage.setItem("token", response.data.token);
      navigate("/home", { state: response.data });
    } else {
      alert(response.data.msg);
    }
  };

  let validateToken = async () => {
    let dataToSend = new FormData();
    dataToSend.append("token", localStorage.getItem("token"));

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "http://localhost:1234/validateToken",
      reqOptions
    );

    let JSOData = await JSONData.json();

    console.log(JSOData);
  };

  return (
    <div className="App">
      <form>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              //validateCredentials();
              validateCredentialsThruAxios();
            }}
          >
            Login
          </button>
        </div>
      </form>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default Login;
