import React, { useRef, useEffect } from "react";
import UserModal from "../Modals/UserModal";
import { useNavigate } from "react-router-dom";

const HomeNav = ({ className }) => {
  const navigation = useNavigate();

  return (
    <div className={`${className} flex flex-row justify-between`}>
      <button
        className="px-10 py-2 border-white rounded-[0.3125rem] border-2"
        onClick={() => navigation("/")}
      >
        CLAW Home
      </button>

      <UserModal />
    </div>
  );
};

export default HomeNav;
