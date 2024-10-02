import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import UploadDialog from "../components/Dialogs/UploadDialog";
import { setIsThisBypromptFalse } from "../features/DocumentSlice";

const Upload = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setIsThisBypromptFalse());
  }, []);
  return (
    <div className="h-screen p-2">
      <UploadDialog />
    </div>
  );
};

export default Upload;
