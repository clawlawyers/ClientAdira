import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const getRequirements = async (doc_id, type) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/get_requirements`,
      {
        doc_id,
        type,
      }
    );
    return res;
  } catch (e) {
    throw new Error(e.value);
  }
};

export const uploadPre = async (doc_id, req) => {
  console.log(req);
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/upload_prerequisites`,
      {
        data: {
          doc_id: doc_id,
          essential_requirements: req,
        },
      }
    );
    return res;
  } catch (e) {
    throw new Error(e.value);
  }
};
export const uploadOptional = async (doc_id, req) => {
  try {
    const res = axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/upload_optional_parameters`,
      {
        data: {
          doc_id: doc_id,
          optional_requirements: req,
        },
      }
    );
    return res;
  } catch (e) {
    throw new Error(e.value);
  }
};

export const generateDocument = async (doc_id) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/generate_document`,
      {
        doc_id,
      }
    );
    return res;
  } catch (e) {
    console.error(e.value);
  }
};

export const generateDocumentbyPrompt = async (doc_id) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/get_document_prompt_requirements`,
      {
        doc_id,
      }
    );
    return res;
  } catch (e) {
    console.error(e.value);
  }
};
