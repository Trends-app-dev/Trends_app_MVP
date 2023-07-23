import { ERROR, GET_USER_BY_ID, IMAGE, IS_LOGIN, IS_MINIMIZED, SESSION, USER, USERNAME } from "./action-type";


const initialState = {
  user:{},
  userName: '',
  image: 'https://i.stack.imgur.com/4powQ.gif',
  isMinimized: false,
  isLogin: false,
  session: true,
  error:'',
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case IS_LOGIN:
      return {
        ...state,
        isLogin: payload,
      }
    case USER:
      return {
        ...state,
        user: payload,
      }
    case GET_USER_BY_ID:
      return {
        ...state,
        user: payload,
        error: ''
      }
    case SESSION:
      return {
        ...state,
        session: payload,
      }
    case USERNAME:
      return {
        ...state,
        userName: payload,
      }
    case IMAGE:
      return {
        ...state,
        image: payload,
      }
    case IS_MINIMIZED:
      return {
        ...state,
        isMinimized: payload,
      }
      case ERROR:
        return {
          ...state,
          error: payload,
        }
    default:
      return{
        ...state
      }
  }
};

export default reducer;