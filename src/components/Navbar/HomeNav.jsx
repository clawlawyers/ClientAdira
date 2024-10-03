import React, { useRef, useEffect } from "react";
import UserModal from "../Modals/UserModal";
import { useNavigate } from "react-router-dom";

const HomeNav = ({ className }) => {
  const navigation = useNavigate();

  return (
    <div className={`${className} flex flex-row justify-between`}>
      <button
        className="px-5 py-2 border-customBlue rounded-full border-[2px]"
        onClick={() => navigation("/")}
      >
        Home
      </button>

      <UserModal />
    </div>
  );
};

export default HomeNav;
