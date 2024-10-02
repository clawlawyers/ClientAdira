import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, LinearProgress, Box, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GoogleDriveImage from "../../assets/icons/Google_Drive_logo 1.svg";
import FolderImage from "../../assets/icons/dropbox.svg";
import DropBox from "../../assets/icons/—Pngtree—dropbox icon_3584851 1.svg";
import analyzingGif from "../../assets/icons/analyze.gif";
import { useNavigate } from "react-router-dom";
import UserModal from "../Modals/UserModal";
import ResponseDialog from "../Dialogs/EditableDialog";
import { useDispatch, useSelector } from "react-redux";
import { setFileBlob } from "../../features/authSlice";
import { setDocId, setUploadDocText } from "../../features/DocumentSlice";
import axios from "axios";
import {
  setBreakoutData,
  setLoading,
  setError,
} from "../../features/breakoutSlice";

import DocEdit from "../../DocEdit/DocEdit";
import toast from "react-hot-toast";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const UploadDialog = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(""); // "uploading", "complete", "analyzing"
  const [responseText, setResponseText] = useState(""); // State for response text
  const [openResponseDialog, setOpenResponseDialog] = useState(false); // State for dialog visibility
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fileBlob } = useSelector((state) => state.auth);
  const doc_id = useSelector((state) => state.document.docId);
  const breakoutData = useSelector((state) => state.breakout.breakoutData);

  const breakoutCalledRef = useRef(false); // Use ref to avoid re-render on change

  // Memoize breakout function to avoid unnecessary re-creation
  const breakout = useCallback(async () => {
    if (breakoutCalledRef.current) return;
    breakoutCalledRef.current = true;

    dispatch(setLoading(true));

    try {
      const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/breakout`, {
        doc_id: doc_id,
      });
      console.log(res.data);
      await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/generate_db`, {
        doc_id: doc_id,
      });
      // dispatch(setGreenHeading([]));
      dispatch(setBreakoutData(res.data));
      console.log(res.data);
      dispatch(setUploadDocText(res.data.data.fetchedData.document));
      setUploadStatus(""); // Stop the analyzing GIF after response
      setFile(null);
      // setOpenResponseDialog(true); // Open the response dialog
      navigate("/DocPreview");
    } catch (error) {
      console.error("Breakout failed", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      breakoutCalledRef.current = false; // Reset the flag if needed
    }
  }, [doc_id, dispatch]);

  useEffect(() => {
    if (uploadStatus === "analyzing" && doc_id) {
      breakout();
    }
  }, [uploadStatus, doc_id, breakout]);

  const handleDropboxUpload = useCallback(() => {
    console.log("Upload from Dropbox clicked");
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      var file = event.target.files[0];
      if (file) {
        setFile(file);
        setUploadStatus("uploading");

        try {
          const formData = new FormData();
          const response = await axios.get(
            `${NODE_API_ENDPOINT}/ai-drafter/create_document`
          );
          const doc_id = response.data.data.fetchedData.doc_id;
          console.log(doc_id);
          console.log("hi");

          // dispatch(setDocId(doc_id));
          // file.originalname = doc_id + ".docx";
          // file.name = doc_id + ".docx";
          console.log(file);
          const renamedFile = new File([file], doc_id + ".docx", {
            type: file.type,
          });
          formData.append("file", renamedFile);

          formData.append("doc_id", doc_id);
          const res = await axios.post(
            `${NODE_API_ENDPOINT}/ai-drafter/upload_document`,
            formData
            // {
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   },
            // }
          );
          const data = res.data.data.fetchedData;
          console.log(data);
          dispatch(setDocId(data.doc_id));
          dispatch(setUploadDocText(data.document));
          setResponseText(data.document);
          simulateUpload();
        } catch (error) {
          console.error("Upload failed", error);
          toast.error("An error occured");
          navigate("/");
        }
      }
    },
    [dispatch]
  );

  const handleGoogleDriveUpload = useCallback(() => {
    console.log("Upload from Google Drive clicked");
  }, []);

  const handleComputerUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const simulateUpload = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("complete");
        dispatch(setFileBlob(true));
        setUploadStatus("analyzing");
      }
    }, 500);
  }, [dispatch]);

  const handleSaveResponse = useCallback(
    async (text) => {
      // Handle the save action, e.g., save to backend or local storage
      console.log("Saved response text:", text);
      dispatch(setUploadDocText(text));
    },
    [dispatch]
  );
  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("");
    dispatch(setFileBlob(false));
    navigate("/");
  };

  const uploadOptions = [
    {
      src: GoogleDriveImage,
      alt: "Google Drive",
      text: "Upload from Drive",
      hasText: true,
      textClass: "text-neutral-800 text-center font-semibold mt-2",
      onClick: handleGoogleDriveUpload,
    },
    {
      src: FolderImage,
      alt: "Upload from Computer",
      text: "Upload from Computer",
      textClass: "text-neutral-800 text-center font-semibold mt-2",
      hasText: true,
      containerClass: "-mt-5",
      onClick: handleComputerUpload,
    },
    {
      src: DropBox,
      alt: "Dropbox",
      text: "Upload from DropBox",
      textClass: "text-neutral-800 text-center font-semibold ",
      containerClass: "-mt-2",
      hasText: true,
      onClick: handleDropboxUpload,
    },
  ];

  return (
    <div className="bg-customBlack h-full p-3 rounded-md">
      <div className="flex flex-row justify-end w-full">
        <UserModal />
      </div>

      <div className="flex flex-row justify-center w-full  items-center h-[70vh]">
        <div className="flex flex-col w-1/2 p-5 bg-upload-card rounded-md space-y-7">
          <div>
            <div className="w-full flex justify-end">
              {uploadStatus !== "analyzing" && (
                <HighlightOffIcon
                  onClick={handleCancel}
                  className="text-teal-700 text-2xl scale-150 cursor-pointer"
                />
              )}
            </div>

            <div className="flex justify-center">
              <p className="text-teal-700 font-bold text-2xl">
                {!file ? "Upload Your Document" : ""}
              </p>
            </div>
          </div>

          {file ? (
            <div className="flex flex-col w-full items-center space-y-4">
              {uploadStatus === "uploading" && (
                <div className="flex flex-col w-full space-y-5 pb-7 ">
                  <p className="text-2xl font-semibold text-teal-600 text-center">
                    Uploading... {uploadProgress}%
                  </p>

                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ height: "4px", width: "90%", padding: "5px" }}
                  />
                </div>
              )}

              {uploadStatus === "complete" && (
                <p className="text-2xl font-semibold text-teal-600 text-center">
                  Upload Complete
                </p>
              )}

              {uploadStatus === "analyzing" && (
                <div className="flex flex-col items-center">
                  <img
                    src={analyzingGif}
                    alt="Analyzing"
                    className="w-80 h-80"
                  />
                  <p className="text-2xl font-semibold text-teal-600 text-center">
                    Analyzing Documents
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center space-x-12">
              {uploadOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex flex-col justify-center items-center ${
                    option.containerClass || ""
                  }`}
                >
                  <img
                    className="hover:scale-110 duration-300 cursor-pointer"
                    src={option.src}
                    alt={option.alt}
                    onClick={option.onClick}
                  />
                  {option.hasText && (
                    <p className={option.textClass}>{option.text}</p>
                  )}
                  {option.alt === "Upload from Computer" && (
                    <input
                      type="file"
                      accept=".pdf, .doc, .docx, .txt"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDialog;
