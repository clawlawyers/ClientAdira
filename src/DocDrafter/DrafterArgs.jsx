import React, { useState } from "react";
import { Add, Close, EmojiEmotions, Send } from "@mui/icons-material";
import NavbarRight from "../components/Navbar/NavbarRight";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import UserModal from "../components/Modals/UserModal";
import Footer from "../components/ui/Footer";
import { CircularProgress } from "@mui/material";
import loaderGif from "../assets/icons/2.gif";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setDocId,
  clearDocId,
  setUploadDocText,
  setEssentialRequirements,
  setOptionalRequirements,
  clearDocumentState,
  setIsGenerateDocCalledTrue,
} from "../features/DocumentSlice";
import { createDoc, getDocFromPrompt } from "../actions/createDoc";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  generateDocumentbyPrompt,
  getRequirements,
  uploadOptional,
  uploadPre,
} from "../actions/DocType";
import { generateDocument } from "../actions/DocType";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { trimQuotes } from "../utils/utils";
import { formatText } from "../utils/utils";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { steps } from "../utils/tour";
const DrafterArgs = () => {
  const driverObj = driver({
    showProgress: true,
    steps: steps,
  });

  let path = localStorage.getItem("from");

  let navigate = useNavigate();
  let dispatch = useDispatch();
  const [loading, setIsLoading] = useState(false);

  const [isReqCalled, setIsReqCalled] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const prompt = useSelector((state) => state.prompt.prompt);
  const docId = useSelector((state) => state.document.docId);
  const docuText = useSelector((state) => state.document.uploadDocText);
  const isThisByprompt = useSelector((state) => state.document.IsThisByprompt);
  const [uploadDocText, setDocText] = useState("");
  const [fallbackText, setFallbackText] = useState();
  const [EssentialReq, setEssentialReq] = useState([]);
  const [OptionalReq, setOptionalReq] = useState([]);
  const [essentialInputs, setEssentialInputs] = useState({});
  const [optionalInputs, setOptionalInputs] = useState({});
  const [docID, setDocID] = useState(null);
  useEffect(() => {
    dispatch(clearDocId());

    const fetchDocId = async () => {
      try {
        const data = await createDoc().then((data) => {
          const doc_id = data.data.data.fetchedData.doc_id;
          // console.log(doc_id);
          // console.log(data);
          dispatch(setDocId(doc_id));
          setDocID(doc_id);
          if (doc_id && prompt) {
            if (path !== "docType") {
              fetchData(doc_id);
            } else {
              fetchReq(doc_id);
            }
          }
        });
      } catch (error) {
        console.error("Failed to fetch document ID:", error);
      } finally {
        if (path === "docType") {
          driverObj.drive();
        }
      }
    };
    fetchDocId();
  }, []);

  useEffect(() => {
    if (path === "docType")
      setDocText("Please set the requirements to proceed!");
  }, [docId]);

  const fetchReq = async (doc_id) => {
    console.log(docId);

    try {
      setIsLoading(true);
      const data = await getRequirements(doc_id, prompt);
      const res = data.data.data.fetchedData;

      console.log(res);
      setEssentialReq(res.essential_requirements);
      setOptionalReq(res.optional_requirements);

      // Initialize input state
      const initialEssentialInputs = {};
      Object.keys(res.essential_requirements).forEach((req) => {
        initialEssentialInputs[req] = res.essential_requirements[req]
          ? res.essential_requirements[req]
          : "";
      });
      setEssentialInputs(initialEssentialInputs);

      const initialOptionalInputs = {};
      Object.keys(res.optional_requirements).forEach((req) => {
        initialOptionalInputs[req] = res.optional_requirements[req]
          ? res.optional_requirements[req]
          : "";
      });
      setOptionalInputs(initialOptionalInputs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (doc_id) => {
    setIsLoading(true);
    try {
      await getDocFromPrompt(doc_id, prompt).then((data) => {
        const docText = data.data.data.fetchedData.document;
        const processedText = docText;
        setDocText(trimQuotes(processedText));
        // setDocText(docText);
        // console.log(trimQuotes(processedText));
        setFallbackText(
          'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
        );

        dispatch(setUploadDocText(trimQuotes(processedText)));
        console.log(data.data.data.fetchedData);

        const essentialRequirements =
          data.data.data.fetchedData.essential_requirements;
        setEssentialReq(essentialRequirements);
        const initialEssentialInputs = {};
        Object.keys(essentialRequirements || {}).forEach((req) => {
          initialEssentialInputs[req] = essentialRequirements[req]
            ? essentialRequirements[req]
            : "";
        });
        // console.log(initialEssentialInputs);
        setEssentialInputs(initialEssentialInputs);
        dispatch(setEssentialRequirements(essentialRequirements));

        const optionalRequirements =
          data.data.data.fetchedData.optional_requirements;
        setOptionalReq(optionalRequirements);
        const initialOptionalInputs = {};
        Object.keys(optionalRequirements || {}).forEach((req) => {
          initialOptionalInputs[req] = optionalRequirements[req]
            ? optionalRequirements[req]
            : "";
        });
        setOptionalInputs(initialOptionalInputs);
        dispatch(setOptionalRequirements(optionalRequirements));
      });
      // console.log(uploadDocText);
    } catch (e) {
      setDocText("");
      toast.error("Failed to fetch data");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "essential") {
      setEssentialInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (type === "optional") {
      setOptionalInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    // Combine essential and optional inputs into a single object
    const allInputs = {
      essential_requirements: essentialInputs,
      optional_requirements: optionalInputs,
    };

    // Convert the essential requirements to a JSON string with indentation for readability
    const essentialJsonString = JSON.stringify(
      allInputs.essential_requirements,
      null,
      4
    ); // 'null, 4' adds indentation

    // Convert the optional requirements to a JSON string with indentation
    const optionalJsonString = JSON.stringify(
      allInputs.optional_requirements,
      null,
      4
    );

    // Final result where the JSON string is encapsulated as a plain string
    const finalEssentialString = essentialJsonString;
    const finalOptionalString = optionalJsonString;
    try {
      const res1 = await uploadPre(docId, finalEssentialString);
      console.log(res1);
      const res2 = await uploadOptional(docId, finalOptionalString);
      console.log(res2);
      let res;
      if (isThisByprompt) {
        res = await generateDocumentbyPrompt(docId);
      } else {
        res = await generateDocument(docId);
      }
      dispatch(setIsGenerateDocCalledTrue());
      console.log(res.data.data.fetchedData.document);
      setDocText(res.data.data.fetchedData.document);
      setFallbackText(
        'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
      );
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
    } catch (e) {
      console.log(e);
    } finally {
      setReqLoading(false);
      setIsReqCalled(true);
      navigate("/DocPreview");
    }

    // You can send this final string to your API
    console.log(finalOptionalString); // Optional requirements in string format
    console.log(finalEssentialString); // Optional requirements in string format

    toast.success("Requirements saved successfully!");
  };

  const handleSaveRequirements = async (e) => {
    e.preventDefault();
    setReqLoading(true);
    // Combine essential and optional inputs into a single object
    const allInputs = {
      essential_requirements: essentialInputs,
      optional_requirements: optionalInputs,
    };

    // Convert the essential requirements to a JSON string with indentation for readability
    const essentialJsonString = JSON.stringify(
      allInputs.essential_requirements,
      null,
      4
    ); // 'null, 4' adds indentation

    // Convert the optional requirements to a JSON string with indentation
    const optionalJsonString = JSON.stringify(
      allInputs.optional_requirements,
      null,
      4
    );

    // Final result where the JSON string is encapsulated as a plain string
    const finalEssentialString = essentialJsonString;
    const finalOptionalString = optionalJsonString;
    try {
      const res1 = await uploadPre(docId, finalEssentialString);
      console.log(res1);
      const res2 = await uploadOptional(docId, finalOptionalString);
      console.log(res2);
      let res;
      if (isThisByprompt) {
        res = await generateDocumentbyPrompt(docId);
      } else {
        res = await generateDocument(docId);
      }
      dispatch(setIsGenerateDocCalledTrue());
      console.log(res.data.data.fetchedData.document);
      setDocText(res.data.data.fetchedData.document);
      setFallbackText(
        'Sale Agreement\n\nThis Sale Agreement ("Agreement") is made and entered into on this [DATE] by and between:\n\n1. [SELLER\'S NAME], residing at [SELLER\'S ADDRESS] (hereinafter referred to as the "Seller"); \nand\n2. [BUYER\'S NAME], residing at [BUYER\'S ADDRESS] (hereinafter referred to as the "Buyer").\n\nRecitals:\n\nWHEREAS, the Seller is the legal and beneficial owner of the property described below and desires to sell the same to the Buyer.\n\nWHEREAS, the Buyer is desirous of purchasing the said property from the Seller on the terms and conditions set forth in this Agreement.\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements hereinafter set forth, the parties hereto agree as follows:\n\n1. Description of Property:\nThe property being sold under this Agreement is described as [PROPERTY DETAILS, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The Seller hereby confirms that the property is free from all encumbrances, claims, and demands whatsoever.\n\n'
      );
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
    } catch (e) {
      console.log(e);
    } finally {
      setReqLoading(false);
      setIsReqCalled(true);
    }

    // You can send this final string to your API
    console.log(finalOptionalString); // Optional requirements in string format
    console.log(finalEssentialString); // Optional requirements in string format

    toast.success("Requirements saved successfully!");
    navigate("/DocEdit");
  };

  return (
    <div className="flex flex-col h-screen justify-between space-y-2 w-full p-5">
      <div className="flex flex-row justify-between w-full items-center">
        <NavbarRight showMenu={false} />
        <NavbarLeft />
      </div>

      <div className="flex space-x-5 flex-row w-full h-[80%]  justify-center items-center">
        <div className="w-[70%] space-y-2 flex flex-col h-full bg-customBlack rounded-md px-5 py-5">
          {/* user */}
          <div className="flex  font-semibold text-lg gap-5 w-full flex-row justify-start items-center">
            <UserModal />
            <div className="h-20 items-center justify-center flex flex-col overflow-y-auto scrollbar-hide">
              {prompt}
            </div>
          </div>
          {/* arguments container */}
          <div
            id="docText"
            className="bg-card-gradient  scrollbar-hide overflow-y-auto scroll-smooth rounded-md w-full flex flex-col items-start p-5 h-full"
          >
            {loading ? (
              <div className="flex flex-col h-full items-center justify-center w-full">
                <img
                  className="flex flex-row justify-center items-center w-40 h-40"
                  src={loaderGif}
                  alt="Loading..."
                />
              </div>
            ) : (
              <div>
                <Markdown rehypePlugins={[rehypeRaw]}>
                  {formatText(
                    trimQuotes(uploadDocText.replace(/\u20B9/g, "₹"))
                  )}
                </Markdown>
              </div>
            )}
          </div>
        </div>
        <div className="w-[30%] space-y-5 flex flex-col justify-center items-center h-full">
          <div className="w-full p-2 flex justify-center items-center h-full overflow-y-auto rounded-md flex-col bg-customBlack">
            {loading ? (
              <img
                className="flex flex-row justify-center items-center w-40 h-40"
                src={loaderGif}
                alt="Loading..."
              />
            ) : (
              <form
                id="reqPanel"
                className="space-y-3 p-2 flex flex-col h-full w-full overflow-auto scrollbar-hide text-sm"
                onSubmit={handleSaveRequirements}
              >
                <div className="flex flex-col gap-3">
                  <div className="text-sm">
                    <h2 className="underline text-primary-theme-white-50 font-bold">
                      Essential Requirements
                    </h2>
                    {Object.keys(EssentialReq || {}).map((req, index) => (
                      <div key={index}>
                        <label
                          htmlFor={req}
                          className="text-primary-theme-white-50 text-xs"
                        >
                          {req}
                        </label>
                        <input
                          type="text"
                          name={req}
                          value={essentialInputs[req]}
                          onChange={(e) => handleInputChange(e, "essential")}
                          className="w-full p-0.5 bg-customBlack border-white rounded-md text-primary-theme-white-50 "
                        />
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-0.5 bg-white/50 rounded-md" />
                  <div>
                    <h2 className="underline text-primary-theme-white-50 font-bold">
                      Optional Requirements
                    </h2>
                    {Object.keys(OptionalReq || {}).map((req, index) => (
                      <div key={index}>
                        <label
                          htmlFor={req}
                          className="text-primary-theme-white-50 text-xs"
                        >
                          {req}
                        </label>
                        <input
                          type="text"
                          name={req}
                          value={optionalInputs[req]}
                          onChange={(e) => handleInputChange(e, "optional")}
                          className="w-full p-2 bg-customBlack border-white rounded-md text-primary-theme-white-50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="flex flex-row w-full  justify-between items-center">
            <button
              onClick={() => {
                if (path !== "docType") navigate("/Drafter");
                else navigate("/DocType");
              }}
              className="transition ease-in-out duration-1000  hover:scale-110  bg-btn-gradient p-2 rounded-md text-sm border-white border-2"
            >
              {path !== "docType" ? "Re-enter Prompt" : "Re-select doctype"}
            </button>
            <button
              id="Generate"
              onClick={handleGenerate}
              disabled={loading || reqLoading}
              className={`${
                loading || reqLoading
                  ? "opacity-75 pointer-events-none cursor-not-allowed"
                  : ""
              }border-white border-2 transition ease-in-out duration-1000  hover:scale-110  bg-btn-gradient p-2  rounded-md text-sm`}
            >
              {reqLoading ? "Generating ..." : "Generate Document"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DrafterArgs;
