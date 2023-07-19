import { USERNAME } from "./action-type";


const initialState = {
  userName: '',
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USERNAME:
      return {
        ...state,
        userName: payload,
      }
    default:
      return{
        ...state
      }
  }
};

export default reducer;