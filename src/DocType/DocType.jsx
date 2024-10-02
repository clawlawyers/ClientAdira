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
    <main className="flex flex-col h-screen w-full items-center justify-center p-5">
      <section className="bg-customBlack flex flex-col justify-between items-center h-fit rounded-md w-full ">
        <div className="flex flex-col justify-center items-center w-full space-y-10 p-5">
          <HomeNav className="w-full" />
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
            {/* <select
              className="p-2 w-full bg-slate-200 rounded-md text-neutral-800 border-2 outline-none border-teal-500 text-sm"
              value={selectedValue}
              onChange={handleSelectChange}
              required
              disabled={loading}
            >
              <option value="" disabled selected>
                Select an Option
              </option>
              {Object?.keys(optionTypes?.type || {}).map((item, index) => (
                <option key={index} value={item}>
                  {item
                    .split(" ")
                    .map((x) => {
                      return x[0].toUpperCase() + x.slice(1);
                    })
                    .join(" ")}
                </option>
              ))}
            </select> */}
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
            {/* <select
              className="p-2 w-full bg-slate-200 rounded-md text-neutral-800 border-2 outline-none border-teal-500 text-sm"
              value={selectedSubType}
              onChange={(e) => setSelectedSubType(e.target.value)}
              required
              disabled={loading || selectedValue === ""}
            >
              <option value="" disabled selected>
                Select a Type
              </option>
              {subOption.map((item, index) => (
                <option key={index} value={item}>
                  {item
                    .split(" ")
                    .map((x) => {
                      return x[0].toUpperCase() + x.slice(1);
                    })
                    .join(" ")}
                </option>
              ))}
            </select> */}
            <button
              disabled={selectedSubType === ""}
              className="bg-btn-gradient  p-2 px-9 rounded-md"
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
        <Footer className="w-full" />
      </section>
    </main>
  );
};

export default DocType;
