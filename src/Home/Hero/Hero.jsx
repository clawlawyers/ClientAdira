import React, { useEffect } from "react";
import { useState } from "react";

import UserModal from "../../components/Modals/UserModal";

import LoginDialog from "../../components/Dialogs/LoginDialog";
import Footer from "../../components/ui/Footer";
import HomeNav from "../../components/Navbar/HomeNav";
import HeroPage from "../../components/ui/HeroPage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-2">
      <div
        className="flex flex-col h-screen w-full  z-20 gap-3 bg-black bg-opacity-80 rounded-lg p-4"
        // style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 10px white" }}
      >
        <div className="h-[10%] w-full ">
          <HomeNav />
        </div>
        <div className="flex flex-col justify-between w-full h-full  ">
          <HeroPage></HeroPage>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Hero;
