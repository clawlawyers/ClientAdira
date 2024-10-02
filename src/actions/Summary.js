import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const getSummary = async (doc_id) => {
  try {
    const res = await axios.post(`${NODE_API_ENDPOINT}/ai-drafter/summarize`, {
      doc_id: doc_id,
    });

    return res;
  } catch (e) {
    throw new Error("catch", e);
  }
};
