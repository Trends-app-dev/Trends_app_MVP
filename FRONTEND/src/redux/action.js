import axios from 'axios';
import { ERROR, GET_USER_BY_ID, IMAGE, IS_LOGIN, IS_MINIMIZED, SESSION, USER, USERNAME } from "./action-type";

export const setUserName = (userName) => {
  return {
    type: USERNAME,
    payload: userName,
  }
};

export const setImage = (image) => {
  return {
    type: IMAGE,
    payload: image,
  }
};

export const setIsMinimized = (boolean) => {
  return {
    type: IS_MINIMIZED,
    payload: boolean
  }
};

export const setIsLogin = (boolean) => {
  return {
    type: IS_LOGIN,
    payload: boolean
  }
};

export const setSession = (boolean) => {
  return {
    type: SESSION,
    payload: boolean
  }
};

export const setUser = (user) => {
  return {
    type: USER,
    payload: user
  }
}

export const getUserById = (userId) => {
    return async (dispatch) => {
      try {
        const { data } = await axios.get(`http://localhost:3007/api/v1/users/${userId}`);
        return dispatch({
          type: GET_USER_BY_ID,
          payload: data
        })
      } catch (error) {
        return dispatch({
          type: ERROR,
          payload: error.message
        })
      }
    };
};