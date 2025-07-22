const authReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, data: action?.data };
    default:
      return state;
  }
};

export default authReducer;
