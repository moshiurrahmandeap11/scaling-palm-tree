"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { IUser } from "@/lib/types";
import { api } from "@/lib/api";

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: IUser) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Read persisted auth synchronously so a page reload on a private route
// does NOT bounce the user back to /login.
function readPersisted(): { token: string | null; user: IUser | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    const user = raw ? (JSON.parse(raw) as IUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((t: string | null, u: IUser | null) => {
    if (typeof window === "undefined") return;
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  }, []);

  const login = useCallback(
    (t: string, u: IUser) => {
      setToken(t);
      setUserState(u);
      setLoading(false);
      persist(t, u);
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserState(null);
    persist(null, null);
  }, [persist]);

  const setUser = useCallback(
    (u: IUser) => {
      setUserState(u);
      persist(token, u);
    },
    [persist, token]
  );

  // Re-sync user from the server (e.g. after credits change).
  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get<{ user: IUser }>("/auth/me");
      setUser(res.user);
    } catch {
      // token may be invalid; keep existing state
    }
  }, [token, setUser]);

  // Restore local auth after hydration, then verify it with the API. The
  // dashboard waits for this check, so private-route reloads never bounce to login.
  useEffect(() => {
    const restore = async () => {
      const persisted = readPersisted();
      if (!persisted.token) {
        setLoading(false);
        return;
      }
      setToken(persisted.token);
      setUserState(persisted.user);
      try {
        const response = await api.get<{ user: IUser }>("/auth/me");
        setUserState(response.user);
        persist(persisted.token, response.user);
      } catch {
        setToken(null);
        setUserState(null);
        persist(null, null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
