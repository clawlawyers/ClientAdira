import React, { useState } from "react";
import LoginDialog from "../components/Dialogs/LoginDialog";
import Footer from "../components/ui/Footer";
import LoginHome from "./LoginHome";
import aiIcon from "../assets/icons/back2.gif";


const Login = () => {
  const [loginPopup, setLoginPopup] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);







  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative p-4">
      {/* <div className="w-full h-full flex justify-center absolute py-2">
        <img className="" src={aiIcon} />
      </div> */}
      <div
        className="flex flex-col h-screen w-full  z-20 p-2 gap-3 bg-black bg-opacity-80 rounded-lg"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 10px white" }}
      >
        <div className="flex flex-col justify-between w-full h-full  ">
          <LoginHome setLoginPopup={setLoginPopup} />
          <Footer />
        </div>

        {loginPopup && <LoginDialog setLoginPopup={setLoginPopup} />}
      </div>
    </div>
  );
};

export default Login;
