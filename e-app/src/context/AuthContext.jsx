import { createContext, useReducer, useEffect, useContext } from "react";
import { authReducer, initialAuthState } from "./authReducer";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, () => {
    const savedAuth = localStorage.getItem("APP_AUTH");
    const savedUsers = localStorage.getItem("APP_USERS");
    const auth = savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, user: null, error: null };
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    return { ...auth, users };
  });

  useEffect(() => {
    localStorage.setItem("APP_AUTH", JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error
    }));
    localStorage.setItem("APP_USERS", JSON.stringify(state.users));
  }, [state]);

  const signup = (data) => {
    const existingUser = state.users.find(u => u.email === data.email);
    if (existingUser) {
      dispatch({ type: "SET_ERROR", payload: "Email already exists" });
      return false;
    }
    dispatch({ type: "SIGNUP", payload: data });
    return true;
  };

  const login = (data) => {
    const user = state.users.find(u => u.email === data.email && u.password === data.password);
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
      return true;
    } else {
      dispatch({ type: "SET_ERROR", payload: "Invalid email or password" });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userId, updates) => {
    dispatch({ type: "UPDATE_USER", payload: { userId, updates } });
  };

  const removeUser = (userId) => {
    dispatch({ type: "REMOVE_USER", payload: userId });
  };

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout, updateUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);