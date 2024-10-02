import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setOtpVerified } from "../../features/authSlice";
import CloseIcon from "../../assets/svg/CloseIcon";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  // RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const LoginDialog = ({ setLoginPopup }) => {
  const dispatch = useDispatch();
  const { isOtpVerified } = useSelector((state) => state.auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [localOtp, setLocalOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  // const [phoneNumber, setPhoneNumber] = useState();
  const [getOtp, setGetOtp] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  const navigate = useNavigate();

  // Function to clear children of an element
  function clearRecaptchaChildren() {
    const recaptchaElement = document.getElementById("recaptcha");

    if (recaptchaElement) {
      while (recaptchaElement.firstChild) {
        recaptchaElement.removeChild(recaptchaElement.firstChild);
      }
    } else {
      console.warn('Element with ID "recaptcha" not found.');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Example usage
    clearRecaptchaChildren();
    // check ether mobile number is registered or not
    const fetchedResp = await fetch(
      `${NODE_API_ENDPOINT}/clientAdira/clientAdiraValidation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      }
    );

    if (!fetchedResp.ok) {
      alert("This number is not registered!");
      return;
    }

    // handleDisableButton();
    console.log("sendOTP");

    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log(response);
      },
      auth,
    });

    console.log("I am here");
    console.log(phoneNumber);

    signInWithPhoneNumber(auth, "+91" + phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        alert("OTP sent!");
        setGetOtp(true);
        setShowOtpDialog(true);
      })
      .catch((error) => {
        alert("Error during OTP request");
        console.error("Error during OTP request:", error);
        setGetOtp(false);
      });
  };

  const handleVerifyOtp = async () => {
    const credential = PhoneAuthProvider.credential(verificationId, localOtp);
    localStorage.setItem("loginOtp", localOtp);

    signInWithCredential(auth, credential)
      .then(async (userCredential) => {
        const user = userCredential.user;
        alert("Phone number verified successfully!");

        const props = await fetch(`${NODE_API_ENDPOINT}/clientAdira/getuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${parsedUser.token}`,
          },
        });

        if (!props.ok) {
          alert("User not found!");
          return;
        }
        const parsedProps = await props.json();
        console.log(parsedProps.data);
        // dispatch(login({ user: parsedProps.data }));
        // navigate("/courtroom-ai");
      })

      .catch((error) => {
        console.error("Error during OTP verification:", error);
        // setProceedToPayment(false);
      });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setShowOtpDialog(true);
  // };

  // const handleVerifyOtp = () => {
  //   // Simulate OTP verification logic
  // };

  const handleOtpVerification = (e) => {
    setLocalOtp(e.target.value);
  };

  return (
    <div className="fixed flex backdrop-blur-sm w-full h-full top-0 left-0 items-center justify-center z-50">
      <div className="w-2/4 flex relative border-white border-2 rounded-[0.625rem] flex-col gap-12 p-10 bg-popup-gradient">
        <div
          className="absolute right-3 hover:cursor-pointer top-2"
          onClick={() => setLoginPopup(false)}
        >
          <CloseIcon />
        </div>
        <div className="flex flex-col items-center">
          <div className="font-sans text-[1.5rem] text-white">Log In To</div>
          <div className="font-sans text-[3.0rem] leading-[3rem] -tracking-[0.09rem] text-white font-extrabold">
            Adira AI
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-1/2 pl-4 p-1 bg-customInput text-black rounded-[0.625rem] border-2 border-black"
                  type="text"
                />

                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-1/2 pl-4 p-2 text-black bg-customInput rounded-[0.625rem] border-2 border-black"
                  type="text"
                />
              </div>
              <div className="flex flex-row gap-2">
                <input
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your Number"
                  className="w-3/4 pl-4 p-2 bg-customInput rounded-[0.625rem] border-2 border-black text-black"
                  type="text"
                  disabled={isOtpVerified}
                />

                <button
                  type="submit"
                  className="w-1/4 text-center p-2 bg-customOTP rounded-[0.625rem] border-customBORDER border-2 hover:cursor-pointer"
                >
                  {/* {isOtpVerified ? "Sign In" : "Send OTP"} */}
                  Send OTP
                </button>
              </div>
            </div>
          </form>

          {showOtpDialog && (
            <div className="flex flex-row gap-2">
              <input
                required
                placeholder="OTP"
                className="w-2/3 pl-4 p-2 text-black bg-customInput rounded-[0.625rem] border-2 border-black"
                type="text"
                value={localOtp}
                onChange={handleOtpVerification}
              />
              <div
                className="w-1/3 p-2 text-center text-nowrap text-white border-white rounded-[0.625rem] border-2 hover:cursor-pointer"
                onClick={() => {
                  /* Resend OTP logic */
                }}
              >
                Resend OTP
              </div>
              <div
                className="w-1/3 p-2 text-center bg-customOTP rounded-[0.625rem] border-customBORDER border-2 hover:cursor-pointer"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </div>
            </div>
          )}
        </div>
        <div id="recaptcha"></div>
      </div>
    </div>
  );
};

export default LoginDialog;
