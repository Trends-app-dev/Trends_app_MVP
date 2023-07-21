import { IS_MINIMIZED, USERNAME } from "./action-type";


const initialState = {
  userName: '',
  isMinimized: false,
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USERNAME:
      return {
        ...state,
        userName: payload,
      }
    case IS_MINIMIZED:
      return {
        ...state,
        isMinimized: payload,
      }
    default:
      return{
        ...state
      }
  }
};

export default reducer;