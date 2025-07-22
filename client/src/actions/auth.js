import * as api from "../api/index";

export const login = (authData) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);
    dispatch({ type: "AUTH", data });
  } catch (error) {
    console.log(error);
  }
};
