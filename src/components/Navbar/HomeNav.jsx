import React, { useRef, useEffect } from "react";
import UserModal from "../Modals/UserModal";
import { useNavigate } from "react-router-dom";

const HomeNav = ({ setLoginPopup, isLoggedIn, className }) => {
  const navigation = useNavigate();
  const popupRef = useRef(null);

  // Close popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setLoginPopup(false);  // Close the popup
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setLoginPopup]);

  return (
    <div className={`${className} flex flex-row justify-between`}>
      <button
        className="px-10 py-2 border-white rounded-[0.3125rem] border-2"
        onClick={() => navigation("/")}
      >
        CLAW Home
      </button>
      {isLoggedIn ? (
        <div ref={popupRef}>
          <button
            onClick={() => setLoginPopup(true)}
            className="px-14 py-2 font-sans bg-customBlue border-black rounded-[0.3125rem] border-2 "
          >
            Log In
          </button>
          {/* Popup component or content */}
          {/* You can conditionally render the popup here */}
        </div>
      ) : (
        <UserModal />
      )}
    </div>
  );
};

export default HomeNav;
