import React, { useEffect, useState } from "react";
import UserModal from "../components/Modals/UserModal";
import Footer from "../components/ui/Footer";
import CustomInput from "../components/ui/CustomInput";
import HeroText from "../components/ui/Hero";
import Banner from "../components/ui/Banner";
import { createDoc, getDocFromPrompt } from "../actions/createDoc";
import { useDispatch, useSelector } from "react-redux";
import aiIcon from "../assets/icons/back.gif";

import { setPrompt } from "../features/PromptSlice";
import { useNavigate } from "react-router-dom";
import {
  setIsThisBypromptFalse,
  setIsThisBypromptTrue,
} from "../features/DocumentSlice";
import { TextField } from "@mui/material";
import HomeNav from "../components/Navbar/HomeNav";

const DocDrafter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [prompt, setPromptValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setPromptValue(e.target.value);
  };

  const handleSubmit = () => {
    localStorage.setItem("from", "drafter");
    dispatch(setPrompt(prompt));
    navigate("/Drafter/DrafterArgs");
  };

  useEffect(() => {
    dispatch(setIsThisBypromptTrue());
  }, []);

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
        <div className="flex flex-col w-full h-full items-center">
          <div className="h-[10%] w-full ">
            <HomeNav />
          </div>
          <div className="h-full flex flex-col justify-between">
            <HeroText />
            <Banner />

            <div className="flex flex-col gap-2 justify-center w-full">
              {/* <CustomInput
              onSubmit={handleSubmit}
              btn={true}
              placeholder="Type prompt to generate a new document"
              onChange={onChange}
              loading={loading}
              value={prompt}
              required={true}
            /> */}
              <div className="flex gap-2">
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  size="small"
                  sx={{ backgroundColor: "white" }}
                  placeholder="Type prompt to generate a new document"
                  multiline
                  maxRows={4}
                  value={prompt}
                  onChange={onChange}
                />
                <button
                  disabled={prompt === ""}
                  onClick={handleSubmit}
                  className="bg-btn-gradient p-2 font-semibold px-4 rounded-md"
                >
                  Send
                </button>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocDrafter;
