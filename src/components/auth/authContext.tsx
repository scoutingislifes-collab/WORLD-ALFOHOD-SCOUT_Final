import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

export type UserRole = "يافع" | "قائد" | "متطوع" | "شريك" | "student" | "instructor" | string;

export type User = {
  id: number;
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

type ApiUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  age: number | null;
  city: string | null;
  emailVerified: number;
  createdAt: string;
};

function generateColor(seed: string) {
  const colors = ["#1f8a5b", "#d4a017", "#0d6e88", "#8a4f00", "#5b3aa6", "#a83a3a"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length];
}

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.fullName,
    email: u.email,
    avatarColor: generateColor(u.email),
    role: u.role,
    joinedAt: u.createdAt,
    country: u.city || undefined,
  };
}

type AuthContextValue = {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; role: string; country?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => void;
  // Backward-compat shim for any legacy code still using dispatch
  dispatch: (action: { type: string; payload?: any }) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    apiRequest("GET", "/api/auth/me")
      .then((data: any) => {
        if (data?.user) {
          setState({ user: mapApiUser(data.user), isLoading: false });
        } else {
          setState({ user: null, isLoading: false });
        }
      })
      .catch(() => setState({ user: null, isLoading: false }));
  }, []);

  async function signIn(email: string, password: string) {
    const data = await apiRequest("POST", "/api/auth/login", { email, password });
    setState({ user: mapApiUser(data.user), isLoading: false });
  }

  async function register(input: { name: string; email: string; password: string; role: string; country?: string }) {
    const data = await apiRequest("POST", "/api/auth/register", {
      email: input.email,
      password: input.password,
      fullName: input.name,
      role: input.role,
      city: input.country,
    });
    setState({ user: mapApiUser(data.user), isLoading: false });
  }

  async function signOut() {
    try { await apiRequest("POST", "/api/auth/logout"); } catch {}
    setState({ user: null, isLoading: false });
  }

  function updateProfile(patch: Partial<User>) {
    setState(s => s.user ? { ...s, user: { ...s.user, ...patch } } : s);
  }

  function dispatch(action: { type: string; payload?: any }) {
    if (action.type === "SIGN_OUT") {
      void signOut();
    } else if (action.type === "UPDATE_PROFILE" && action.payload) {
      updateProfile(action.payload);
    }
  }

  return (
    <AuthContext.Provider value={{ state, signIn, register, signOut, updateProfile, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
