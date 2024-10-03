import React from "react";
import { useNavigate } from "react-router-dom";
import Cloud from "../../assets/icons/Cloud.svg";
import Type from "../../assets/icons/Type.svg";
import Prompt from "../../assets/icons/Prompt.svg";
import UserModal from "../../components/Modals/UserModal";
import { TypeAnimation } from "react-type-animation";

const HeroPage = () => {
  let navigate = useNavigate();
  return (
    <div className="flex flex-col gap-5 items-center justify-between w-full h-full px-4">
      <div className="flex flex-col gap-4 items-center text-center">
        <div className="font-sans font-medium text-xl">Welcome to</div>
        <div className="font-sans w-72 font-semibold text-6xl px-6 py-2 bg-logo-gradient rounded">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "Adira AI",
              3000,
              "",
              1000,
              // "Frontend Developer",
              // 2000,
            ]}
            wrapper="span"
            speed={1}
            style={{
              fontSize: "3.5rem",
              fontWeight: "700",
              display: "inline-block",
            }}
            repeat={Infinity}
          />
        </div>
        <div className="font-sans font-medium text-xl mt-2">
          AI Powered Legal Document Drafter by CLAW
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div
          onClick={() => navigate("/upload")}
          className="hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-2 items-center justify-center px-3 py-6 rounded-lg border-2 border-white"
        >
          <img src={Cloud} alt="Upload Icon" />
          <p className="text-center text-sm px-1">Upload Your Document</p>
        </div>
        <div
          onClick={() => navigate("/Drafter")}
          className="hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-2 items-center justify-center  px-3 py-6 rounded-lg border-2 border-white"
        >
          <img src={Prompt} alt="Prompt Icon" />
          <p className="text-center text-sm  px-1">
            Create Document from Prompt
          </p>
        </div>
        <div
          onClick={() => navigate("/DocType")}
          className="hover:scale-110 duration-200 cursor-pointer bg-logo-gradient flex flex-col gap-2 items-center justify-center  px-3 py-6 rounded-lg border-2 border-white"
        >
          <img src={Type} alt="Type Icon" />
          <p className="text-center text-sm  px-1">Select Type of Document</p>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
