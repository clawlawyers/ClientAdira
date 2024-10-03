import React, { useEffect } from "react";
import HomeNav from "../components/Navbar/HomeNav";
import HeroText from "../components/ui/Hero";
import Footer from "../components/ui/Footer";
import Banner from "../components/ui/Banner";
import { useState } from "react";
import CustomDropdown from "../components/ui/CustomSelect";
// import { options } from "./Options";
import { setPrompt } from "../features/PromptSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { steps } from "../utils/tour";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { Autocomplete, TextField } from "@mui/material";
import aiIcon from "../assets/icons/back.gif";

const DocType = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const [selectedValue, setSelectedValue] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const [loading, setLoading] = useState(false);

  const [optionTypes, setOptionTypes] = useState({});
  const [subOption, setSubOptions] = useState([]);

  useEffect(() => {
    if (selectedValue !== "") {
      setSelectedSubType("");
      const findSelectedValueArr = Object.values(
        optionTypes?.type[selectedValue] || {}
      );
      setSubOptions(findSelectedValueArr);
    }
  }, [selectedValue]);

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Perform submit action
    localStorage.setItem("from", "docType");

    dispatch(setPrompt(selectedSubType.replace(/\s*\(.*?\)\s*/g, "")));

    navigate("/Drafter/DrafterArgs");
    setLoading(false);
  };

  useEffect(() => {
    getType();
  }, []);

  const getType = async () => {
    setLoading(true);
    const type = await fetch(`${NODE_API_ENDPOINT}/ai-drafter/api/get_types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!type.ok) {
      console.error("Error fetching types");
      return;
    }

    const parsedType = await type.json();
    // console.log(parsedType);
    setOptionTypes(parsedType.data.fetchedData);
    setLoading(false);
  };

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen p-2 relative">
      <div
        className="w-full h-screen absolute p-3 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 0%, #018585, transparent 45%)`,
        }}
      >
        <img className="w-full h-full opacity-50" src={aiIcon} />
      </div>
      <section
        className="bg-black bg-opacity-20 flex flex-col justify-between items-center h-full rounded-md w-full p-4 z-20"
        style={{ boxShadow: "0 0 5px white, 0 0 10px white, 0 0 5px white" }}
      >
        <div className="flex flex-col justify-center items-center w-full h-full ">
          <HomeNav className="w-full" />
          <div className="flex flex-col h-full justify-between">
            <HeroText />
            {/* <CustomDropdown
            className="w-full"
            options={optionTypes}
            placeholder="Select an option"
            onChange={handleSelectChange}
            onSubmit={handleSubmit}
            loading={loading}
            value={selectedValue}
          /> */}
            <Banner />
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Autocomplete
                size="small"
                disablePortal
                disabled={loading}
                options={Object?.keys(optionTypes?.type || {})}
                // sx={{ width: 300 }}
                fullWidth
                disableClearable
                value={selectedValue}
                onChange={(event, newValue) => {
                  setSelectedValue(newValue);
                }}
                getOptionLabel={(option) => {
                  return option
                    ? option
                        .split(" ")
                        .map((x) => {
                          return x[0].toUpperCase() + x.slice(1);
                        })
                        .join(" ")
                    : "";
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select an Option"
                    // label="Select an Option"
                    sx={{
                      backgroundColor: "white",
                    }}
                  />
                )}
              />
              <Autocomplete
                size="small"
                disabled={loading || selectedValue === ""}
                disablePortal
                options={subOption}
                fullWidth
                disableClearable
                // sx={{ width: 300 }}
                value={selectedSubType}
                onChange={(event, newValue) => {
                  setSelectedSubType(newValue);
                }}
                getOptionLabel={(option) => {
                  return option
                    ? option
                        .split(" ")
                        .map((x) => {
                          return x[0].toUpperCase() + x.slice(1);
                        })
                        .join(" ")
                    : "";
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select a Type"
                    sx={{
                      backgroundColor: "white",
                    }}
                  />
                )}
              />
              <button
                disabled={selectedSubType === ""}
                className="bg-btn-gradient  p-2 px-9 rounded-md"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
        <Footer className="w-full" />
      </section>
    </main>
  );
};

export default DocType;
