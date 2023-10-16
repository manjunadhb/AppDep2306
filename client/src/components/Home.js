import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();
  let loc = useLocation();
  console.log(loc);

  let deleteAccount = async () => {
    let dataToSend = new FormData();
    dataToSend.append("email", loc.state.data.email);

    let reqOptions = {
      method: "DELETE",
      body: dataToSend,
    };

    let JSONData = await fetch("/deleteUser", reqOptions);

    let JSOData = await JSONData.json();

    if (JSOData.status == "success") {
      localStorage.clear();
      alert(JSOData.msg);
      navigate("/");
    } else {
      alert("Some Technical Error, Unable to delete");
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          navigate("/editProfile", { state: loc.state.data });
        }}
      >
        Edit Profile
      </button>
      <button
        onClick={() => {
          deleteAccount();
        }}
      >
        Delete Account
      </button>
      <Link to="/">Logout</Link>

      <h1>
        Welcome{" "}
        {loc && loc.state && loc.state.data && loc.state.data.firstName
          ? loc.state.data.firstName
          : "User"}
        {loc && loc.state && loc.state.data && loc.state.data.lastName
          ? loc.state.data.lastName
          : ""}
      </h1>
      <img src={`${loc.state.data.profilePic}`}></img>
    </div>
  );
}

export default Home;
