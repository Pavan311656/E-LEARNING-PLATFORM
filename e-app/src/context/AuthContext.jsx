import { createContext, useReducer, useEffect, useContext } from "react";
import { authReducer, initialAuthState } from "./authReducer";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState, () => {
    const savedAuth = localStorage.getItem("APP_AUTH");
    const auth = savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, user: null, error: null };
    return auth;
  });

  useEffect(() => {
    localStorage.setItem("APP_AUTH", JSON.stringify({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      error: state.error,
    }));
  }, [state]);

  const getUsers = () => {
    const users = localStorage.getItem("APP_USERS");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("APP_USERS", JSON.stringify(users));
  };

  const signup = async (data) => {
    if (data.password !== data.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Passwords do not match" });
      return false;
    }
    const users = getUsers();
    const existingUser = users.find(user => user.email === data.email);
    if (existingUser) {
      dispatch({ type: "SET_ERROR", payload: "User already exists" });
      return false;
    }
    const newUser = { ...data, id: Date.now() };
    delete newUser.confirmPassword;
    users.push(newUser);
    saveUsers(users);
    dispatch({ type: "SIGNUP", payload: { user: newUser } });
    return true;
  };

  const login = async (data) => {
    const users = getUsers();
    const user = users.find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      dispatch({ type: "SET_ERROR", payload: "Invalid email or password" });
      return false;
    }
    dispatch({ type: "LOGIN", payload: { user } });
    return true;
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userId, updates) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
      if (state.user && state.user.id === userId) {
        dispatch({ type: "LOGIN", payload: { user: users[index] } });
      }
    }
  };

  const removeUser = (userId) => {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    saveUsers(filteredUsers);
    if (state.user && state.user.id === userId) {
      logout();
    }
  };

  const updateUserProfile = (profileData) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...profileData };
      dispatch({ type: "LOGIN", payload: { user: updatedUser } });
      updateUser(state.user.id, profileData);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signup, login, logout, updateUser, removeUser, updateUserProfile, users: getUsers() }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);