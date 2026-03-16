export const initialAuthState = {
  isAuthenticated: false,
  user: null,
  users: [],
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "SIGNUP":
      return {
        ...state,
        users: [...state.users, action.payload],
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, error: null };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.userId ? { ...u, ...action.payload.updates } : u)
      };

    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload)
      };

    default:
      return state;
  }
}
