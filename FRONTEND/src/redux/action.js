import { IS_MINIMIZED, USERNAME } from "./action-type";

export const setUserName = (userName) => {
  return {
    type: USERNAME,
    payload: userName,
  }
};

export const setIsMinimized = (boolean) => {
  return {
    type: IS_MINIMIZED,
    payload: boolean
  }
};