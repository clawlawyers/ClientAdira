import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";

export const getAnswer = async (doc_id, query) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/ai-drafter/edit_document`,
      {
        doc_id: doc_id,
        edit_query: query,
      }
    );
    return res;
  } catch (e) {
    throw new Error(e.value);
  }
};
