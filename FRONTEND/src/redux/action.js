import { USERNAME } from "./action-type";

export const setUserName = (userName) => {
  return {
    type: USERNAME,
    payload: userName,
  }
};