import React, { useEffect, useState } from "react";
import UserModal from "../components/Modals/UserModal";
import Footer from "../components/ui/Footer";
import CustomInput from "../components/ui/CustomInput";
import HeroText from "../components/ui/Hero";
import Banner from "../components/ui/Banner";
import { createDoc, getDocFromPrompt } from "../actions/createDoc";
import { useDispatch, useSelector } from "react-redux";

import { setPrompt } from "../features/PromptSlice";
import { useNavigate } from "react-router-dom";
import {
  setIsThisBypromptFalse,
  setIsThisBypromptTrue,
} from "../features/DocumentSlice";
import { TextField } from "@mui/material";

const DocDrafter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [prompt, setPromptValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setPromptValue(e.target.value);
  };

  const handleSubmit = () => {
    // e.preventDefault();
    localStorage.setItem("from", "drafter");
    dispatch(setPrompt(prompt));
    navigate("/Drafter/DrafterArgs");
  };

  useEffect(() => {
    dispatch(setIsThisBypromptTrue());
  }, []);

  return (
    <div className="flex flex-col h-screen w-full p-2">
      <div className="bg-black bg-opacity-80 flex flex-col space-y-10 p-4 h-full w-full rounded-md">
        <div className="flex flex-col w-full h-full items-center">
          <div className="flex w-full flex-row justify-between">
            <button
              className="px-10 py-2 border-white rounded-[0.3125rem] border-2"
              onClick={() => navigate("/")}
            >
              CLAW Home
            </button>
            <UserModal />
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
              <div className="flex gap-2 items-end">
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
                  className="bg-btn-gradient p-2 font-semibold px-4 rounded-md max-h-fit"
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
