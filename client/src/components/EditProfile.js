import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function EditProfile() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let profilePicInputRef = useRef();
  let [profilePic, setProfilePic] = useState("./images/profilePic.png");

  let loc = useLocation();
  console.log("inside edit profile");
  console.log(loc);

  useEffect(() => {
    firstNameInputRef.current.value = loc.state.firstName;
    lastNameInputRef.current.value = loc.state.lastName;
    passwordInputRef.current.value = loc.state.password;
    console.log("useeffect is calling");
    // setProfilePic(`http://localhost:1234/${loc.state.profilePic}`);
  });

  useEffect(() => {
    // setProfilePic(`http://localhost:1234/${loc.state.profilePic}`);
  }, [profilePic]);

  let sendUpdatedDataToServer = async () => {
    let dataToSend = new FormData();
    dataToSend.append("fn", firstNameInputRef.current.value);
    dataToSend.append("ln", lastNameInputRef.current.value);
    dataToSend.append("email", loc.state.email);
    dataToSend.append("password", passwordInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptions = {
      method: "PATCH",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "http://localhost:1234/udpateDetails",
      reqOptions
    );

    let JSOData = await JSONData.json();

    alert(JSOData.msg);

    console.log(JSOData);
  };

  return (
    <div className="App">
      <form>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Profile Pic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            onChange={() => {
              let selectedFileURL = URL.createObjectURL(
                profilePicInputRef.current.files[0]
              );
              console.log(selectedFileURL);
              setProfilePic(selectedFileURL);
            }}
          ></input>
        </div>
        <div>
          <img className="profilePicPreview" src={profilePic}></img>
        </div>
        <div>
          {/* <button
            type="button"
            onClick={() => {
              sendSignupDataToServer();
            }}
          >
            Sign Up (JSON)
          </button>

          <button
            type="button"
            onClick={() => {
              sendSignupDataToServerURLEncoded();
            }}
          >
            Sign Up (URLEncoded)
          </button> */}
          <button
            type="button"
            onClick={() => {
              sendUpdatedDataToServer();
            }}
          >
            Update
          </button>
        </div>
      </form>
      <Link to="/">Login</Link>
    </div>
  );
}

export default EditProfile;
