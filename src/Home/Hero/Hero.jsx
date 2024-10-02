import React from "react";
import { useState } from "react";

import UserModal from "../../components/Modals/UserModal";

import LoginDialog from "../../components/Dialogs/LoginDialog";
import Footer from "../../components/ui/Footer";
import HomeNav from "../../components/Navbar/HomeNav";
import HeroPage from "../../components/ui/HeroPage";
const Hero = () => {
  const [loginPopup, setLoginPopup] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  //todo: get login credential like user._id to check if user is logged in or not and then setisLoggedIn to true

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-3">
      <div
        className="flex flex-col h-screen w-full  z-20 p-2 gap-3 bg-black bg-opacity-80 rounded-lg"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 10px white" }}
      >
        <div className="h-[10%] w-full ">
          <HomeNav isLoggedIn={isLoggedIn} setLoginPopup={setLoginPopup} />
        </div>
        <div className="flex flex-col justify-between w-full h-full  ">
          <HeroPage></HeroPage>

          <Footer />
        </div>

        {loginPopup && <LoginDialog setLoginPopup={setLoginPopup} />}
      </div>
    </div>
  );
};

export default Hero;
