import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export type UserRole = "يافع" | "قائد" | "متطوع" | "شريك" | string;

export type User = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  role: UserRole;
  joinedAt: string;
  country?: string;
  bio?: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

type AuthAction =
  | { type: "SIGN_IN"; payload: User }
  | { type: "SIGN_OUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, user: action.payload, isLoading: false };
    case "SIGN_OUT":
      return { ...state, user: null, isLoading: false };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Load session on mount
    try {
      const storedSession = localStorage.getItem("cheetahs_session");
      if (storedSession) {
        const user = JSON.parse(storedSession);
        dispatch({ type: "SIGN_IN", payload: user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    // Sync session to localStorage
    if (state.user) {
      localStorage.setItem("cheetahs_session", JSON.stringify(state.user));
      
      // Update the user in the "users" db as well if updating profile
      try {
        const storedUsers = localStorage.getItem("cheetahs_users");
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((u: User) => 
            u.id === state.user?.id ? state.user : u
          );
          localStorage.setItem("cheetahs_users", JSON.stringify(updatedUsers));
        }
      } catch (e) {}
    } else if (!state.isLoading) {
      localStorage.removeItem("cheetahs_session");
    }
  }, [state.user, state.isLoading]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
