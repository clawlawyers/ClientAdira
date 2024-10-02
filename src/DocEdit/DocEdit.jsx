import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HomeNav from "../components/Navbar/HomeNav";
import NavbarRight from "../components/Navbar/NavbarRight";
import NavbarLeft from "../components/Navbar/NavbarLeft";
import { useDispatch, useSelector } from "react-redux";
import loaderGif from "../assets/icons/2.gif";
import EditSidebar from "../components/ui/EditSidebar";
import { useNavigate } from "react-router-dom";
import { formatPdfText, trimQuotes } from "../utils/utils";
import Markdown from "react-markdown";
import { breakout } from "../actions/createDoc";
import { setBreakoutData } from "../features/breakoutSlice";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { formatText } from "../utils/utils";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import PDFDownloadButton from "../PdfDownloader/PdfDoc";
import { Edit } from "@mui/icons-material";
import { setIsGenerateDocCalledFalse } from "../features/DocumentSlice";

const DocEdit = ({ onSave }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ediText = useSelector((state) => state.document.uploadDocText);
  console.log(ediText);
  const isGenerateDocCall = useSelector(
    (state) => state.document.IsGenerateDocCalled
  );
  // console.log(ediText);
  const texteditable = useSelector((state) => state.document.uploadDocText);
  const doc_id = useSelector((state) => state.document.docId);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("preview");
  const [readyDownload, setReadyDownload] = useState(false);
  const [downlaodText, setDownloadText] = useState(ediText);
  const [savebutton, setsavebutton] = useState(true);

  console.log(doc_id);
  let count = 0;
  useEffect(() => {
    // console.log(ediText);

    var data = ediText
      .replaceAll("\\\\n\\\\n", "<br/>")
      .replaceAll("\\\\n", "<br/>")
      .replaceAll("\\n\\n", "<br/>")
      .replaceAll("\\n", "<br/>")
      .replaceAll("\n", "<br/>")
      .replaceAll("\\", "")
      .replaceAll('"', "")
      .replaceAll(":", " :")
      .replaceAll("#", "");
    setText(data);
  }, [ediText]);

  useEffect(() => {
    if (isGenerateDocCall) {
      breakoutFunc();
    }
  }, []);

  const handleEditClick = () => {
    setActiveSidebar("edit");
  };

  const handlePreviewClick = () => {
    localStorage.setItem("SummaryPath", "/DocPreview");
    navigate("/summary");
  };

  const handleSave = () => {
    navigate("/Snippets");
  };

  const breakoutFunc = async () => {
    setLoading(true);
    setsavebutton(false);
    try {
      const res = await breakout(doc_id);

      if ((res.status = 204)) {
        setsavebutton(true);
      }
      dispatch(setBreakoutData(res.data));
      await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/generate_db`, {
        doc_id: doc_id,
      });
    } catch (e) {
      console.log("breakout failed", e);
    } finally {
      setLoading(false);
      dispatch(setIsGenerateDocCalledFalse());
    }
  };
  const handlepdfdownload = async () => {
    // setLoading(true);
    try {

      const sendableDoc=  ediText
      .replaceAll("\\\\n\\\\n", "\n  \n")
      .replaceAll("\\\\n", "\n")
      .replaceAll("\\n\\n", "\n \n")
      .replaceAll("\\n", "\n")
      .replaceAll("\n", "\n")
      .replaceAll("\\", "")
      .replaceAll('"', "")
      .replaceAll(":", " :")
      .replaceAll("#", "")
      .replaceAll("\"", "");
      const response = await fetch(
        `${NODE_API_ENDPOINT}/ai-drafter/api/get_pdf`,
        {
          // Replace with your backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ document: sendableDoc }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Assuming the backend sends the PDF as a blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link to download the PDF
      const a = document.createElement("a");
      a.href = url;
      a.download = "Document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  let temp =
    'Here is a detailed Lease Agreement customized based on the provided details:\n\nLEASE AGREEMENT\n\nThis Lease Agreement is made and entered into on [DATE] by and between:\n\nLessor: [LESSOR\'S NAME], having its registered office at [LESSOR\'S ADDRESS] (hereinafter referred to as the "Lessor")\n\nAND\n\nLessee: [LESSEE\'S NAME], having its registered office at [LESSEE\'S ADDRESS] (hereinafter referred to as the "Lessee")\n\nDESCRIPTION OF PREMISES\nThe Lessor hereby leases to the Lessee the following property: [DETAILED DESCRIPTION OF LEASED PREMISES, INCLUDING ADDRESS, LEGAL DESCRIPTION, AND ANY UNIQUE IDENTIFIERS]. The leased premises is more particularly described and depicted in the attached Schedule A, which is incorporated herein by reference.\n\nLEASE TERM\nThe term of this Lease shall be for a period of [X] years, commencing on [START DATE] and ending on [END DATE] (the "Lease Term"), unless sooner terminated as provided herein. The Lessee shall have the option to renew this Lease for an additional [X] year term, subject to the terms and conditions set forth in the "Renewal" section below.\n\nMONTHLY RENT\nThe Lessee shall pay to the Lessor a monthly rent of Rs. [AMOUNT] (the "Monthly Rent"). The Monthly Rent shall be due and payable on the [DAY] day of each calendar month during the Lease Term.\n\nPAYMENT TERMS\nThe Lessee shall pay the Monthly Rent and all other sums due under this Lease in advance, without demand, deduction, or offset. Payments shall be made by [PAYMENT METHOD, e.g., check, electronic transfer, etc.]. A late fee of [X]% of the Monthly Rent shall be charged for any payment received after the [DAY] day of the month. In the event of non-payment, the Lessor shall have the right to terminate this Lease in accordance with the "Termination" section below.\n\nSECURITY DEPOSIT\nUpon execution of this Lease, the Lessee shall pay to the Lessor a security deposit in the amount of Rs. [AMOUNT] (the "Security Deposit"). The Security Deposit shall be held by the Lessor as security for the faithful performance by the Lessee of all the terms, covenants, and conditions of this Lease. The Security Deposit shall be returned to the Lessee, without interest, within [X] days after the expiration or earlier termination of this Lease, provided that the Lessee has fully performed all of its obligations under this Lease.\n\nUSE OF PROPERTY\nThe Lessee shall use and occupy the leased premises solely for the purpose of [PERMITTED USE] and for no other purpose without the prior written consent of the Lessor. The Lessee shall not use the leased premises for any unlawful or hazardous purpose, and shall comply with all applicable laws, rules, and regulations governing the use and occupation of the property.\n\nMAINTENANCE AND REPAIRS\nThe Lessee shall, at its own cost and expense, keep and maintain the leased premises in good condition and repair, including all structural and non-structural components, and shall make all necessary repairs and replacements. The Lessor shall be responsible for any major structural repairs to the building, provided that such repairs are not necessitated by the Lessee\'s negligence or misuse of the premises. The Lessee shall promptly notify the Lessor of any needed repairs or maintenance.\n\nUTILITIES AND SERVICES\nThe Lessee shall be responsible for the payment of all utility services provided to the leased premises, including but not limited to electricity, water, gas, telephone, internet, and any other services. The Lessee shall also be responsible for the payment of all applicable taxes, fees, and other charges associated with the use and occupation of the property.\n\nTERMINATION\nEither party may terminate this Lease by providing the other party with [X] months\' prior written notice. The Lessor shall have the right to terminate this Lease immediately upon the occurrence of any of the following events: (i) the Lessee\'s failure to pay the Monthly Rent or any other sums due hereunder, (ii) the Lessee\'s breach of any other term, covenant, or condition of this Lease, or (iii) the Lessee\'s insolvency, bankruptcy, or assignment for the benefit of creditors.\n\nRENEWAL\nUpon the expiration of the initial Lease Term, the Lessee shall have the option to renew this Lease for an additional [X] year term, provided that the Lessee gives the Lessor written notice of its intent to renew at least [X] months prior to the expiration of the current Lease Term. The Monthly Rent for the renewal term shall be increased by [X]% of the current Monthly Rent.\n\nINSURANCE\nThe Lessee shall, at its own cost and expense, maintain a comprehensive general liability insurance policy with limits of not less than Rs. [AMOUNT] per occurrence and Rs. [AMOUNT] in the aggregate, naming the Lessor as an additional insured. The Lessee shall also maintain property insurance covering the leased premises and all of the Lessee\'s personal property located therein.\n\nSETTLEMENT\nUpon the expiration or earlier termination of this Lease, the Lessee shall surrender the leased premises in the same condition as it was at the commencement of the Lease Term, ordinary wear and tear excepted. The Lessor shall have the right to deduct from the Security Deposit any amounts necessary to repair any damage to the leased premises or to clean the premises. Any remaining balance of the Security Deposit shall be returned to the Lessee within [X] days of the termination or expiration of this Lease.\n\nGOVERNING LAW\nThis Lease Agreement shall be governed by and construed in accordance with the laws of the [STATE/PROVINCE] of [NAME]. The parties agree to submit to the exclusive jurisdiction of the courts of [CITY/JURISDICTION] for the resolution of any disputes arising under this Lease.\n\nENTIRE AGREEMENT\nThis Lease Agreement, including the attached Schedule A, constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, and negotiations, whether oral or written, with respect to the subject matter hereof. This Lease may be amended or modified only by a written instrument signed by both the Lessor and the Lessee.\n\nMISCELLANEOUS\nThis Lease Agreement shall be binding upon and inure to the benefit of the parties hereto and their respective heirs, successors, and permitted assigns. If any provision of this Lease is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable. This Lease may be executed in counterparts, each of which shall be deemed an original, and all of which together shall constitute one and the same instrument.\n\nIN WITNESS WHEREOF, the parties have executed this Lease Agreement as of the date first written above.\n\nLESSOR:\n[LESSOR\'S NAME]\n\nBy: _____________________________\nName: [NAME]\nTitle: [TITLE]\n\nLESSEE:\n[LESSEE\'S NAME]\n\nBy: _____________________________\nName: [NAME]\nTitle: [TITLE]\n\nWITNESSES:\n1. _____________________________\nName: [NAME]\n\n2. _____________________________\nName: [NAME]\n\nNOTARY PUBLIC:\n_____________________________\nName: [NAME]\nSeal:';

  return (
    <main className="h-screen w-full">
      <section className="flex flex-col p-5 space-y-5 items-center w-full h-full">
        {/* Navbar */}
        <div className="w-full justify-between items-center flex flex-row">
          <NavbarRight />
          <NavbarLeft />
        </div>

        <div className="flex flex-row w-full space-x-5  rounded-md h-[90%] justify-center items-start">
          <div className="flex flex-col bg-customBlack rounded-md w-[70%] h-full space-y-5 justify-between p-5">
            <div className="flex-1 h-full overflow-auto border-white bg-card-gradient flex flex-col justify-center  items-center border-2 rounded-md w-full">
              {loading ? (
                <img
                  className="flex flex-row justify-center items-center w-40 h-40"
                  src={loaderGif}
                  alt="Loading..."
                />
              ) : (
                <p
                  className=" text-sm hide-scrollbar p-2 h-full w-full overflow-y-auto overflow-wrap break-word word-wrap break-word"
                  // rehypePlugins={[rehypeRaw]}
                  dangerouslySetInnerHTML={{
                    __html: text
                      .replaceAll("u20b9", "₹")
                      .replace(/\\u20B9/g, "₹")
                      .replace(/\u20B9/g, "₹"),
                    // .replace(/\\n/, "<br></br>")
                    // .replace(/\\n\\n/, "<br></br><br></br>"),
                    // .replace(/\\/g, "") ,
                  }}
                >
                  {/* {trimQuotes(
                    formatText(
                      text
                        .replace(/\u20B9/g, "₹")
                        .replace(/\\n/, "<br></br>")
                        .replace(/\\n\\n/, "<br></br><br></br>")
                      // .replace(/\\/g, "")
                    )
                  )} */}
                </p>
              )}
            </div>
            <div className="flex flex-row justify-end items-center gap-5">
              {/* <button
                onClick={setReadyDownload(true)}
                className="bg-card-gradient p-2 border border-white rounded-md"
              >
                Download Document
              </button>
              {readyDownload ? ( */}
              {!loading ? (
                // <PDFDownloadButton pdfDownloadText={formatPdfText(ediText)} />
                <button
                  className=" transition ease-in-out duration-1000  hover:scale-110 p-2 rounded-md px-10 border-2 border-teal-700"
                  onClick={handlepdfdownload}
                >
                  Download
                </button>
              ) : (
                <div className="p-2 rounded-md px-10 border-2 border-teal-700">
                  Downloading
                </div>
              )}
              {/* // ) : (
              //   ""
              // )} */}
              <button
                className="transition ease-in-out duration-1000  hover:scale-110 rounded-md p-2 bg-card-gradient text-white font-semibold"
                onClick={handleEditClick}
              >
                Edit Document With AI
              </button>
              <button
                className="transition ease-in-out duration-1000  hover:scale-110 p-2 px-5 rounded-md border-2 border-teal-700"
                onClick={handlePreviewClick}
              >
                Summary
              </button>
              {savebutton ? (
                <button
                  onClick={handleSave}
                  className="transition ease-in-out duration-1000  hover:scale-110 p-2 rounded-md px-10 border-2 border-teal-700"
                >
                  Save
                </button>
              ) : (
                <div className="p-2 rounded-md px-10 border-2 border-teal-700">
                  Loading...
                </div>
              )}
            </div>
          </div>

          <div className="w-[30%] h-full overflow-hidden bg-customBlack rounded-md p-5">
            <AnimatePresence mode="wait">
              {activeSidebar === "edit" ? (
                <motion.div
                  key="edit"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-transparent rounded-md w-full h-full"
                >
                  <EditSidebar />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-transparent rounded-md w-full"
                >
                  <h4 className="font-semibold">Document Preview</h4>
                  <p>
                    Please check the Document Preview before proceeding with AI
                    Drafter.
                  </p>
                  <span className="text-teal-500 font-semibold">
                    Adira AI Drafter
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DocEdit;
