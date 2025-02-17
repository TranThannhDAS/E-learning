const TOKEN_KEY = "auth-token";
const REFRESHTOKEN = "refresh-token";
const USER = "auth-user";

export const getToken = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};

export const setToken = (token) => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};

export const getRefreshToken = () => {
  return JSON.parse(localStorage.getItem(REFRESHTOKEN));
};

export const setRefreshToken = (token) => {
  localStorage.removeItem(REFRESHTOKEN);
  localStorage.setItem(REFRESHTOKEN, JSON.stringify(token));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER));
};

export const setUser = (user) => {
  localStorage.removeItem(USER);
  localStorage.setItem(USER, JSON.stringify(user));
};

export const signOut = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESHTOKEN);
  localStorage.removeItem(USER);
};
