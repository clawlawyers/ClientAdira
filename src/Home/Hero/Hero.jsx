import React from "react";
import Footer from "../../components/ui/Footer";
import HomeNav from "../../components/Navbar/HomeNav";
import HeroPage from "../../components/ui/HeroPage";
import aiIcon from "../../assets/icons/back.gif";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-2 relative">
      <div
        className="w-full h-screen absolute p-3 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        <img className="w-full h-full opacity-50" src={aiIcon} />
      </div>
      <div
        className="flex flex-col h-screen w-full  z-20 gap-3 bg-black bg-opacity-20 rounded-lg p-4"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 5px white" }}
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
