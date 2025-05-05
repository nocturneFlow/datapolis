"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { setAuthHeader } from "@/lib/axios";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null, expires_in?: number) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const previousToken = useRef<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAccessToken = (token: string | null, expires_in?: number) => {
    setAccessTokenState(token);
    setAuthHeader(token);

    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (expires_in) {
      const expiryTime = Date.now() + expires_in * 1000;
      setExpiresAt(expiryTime);
      localStorage.setItem("expiresAt", expiryTime.toString());
    } else {
      setExpiresAt(null);
      localStorage.removeItem("expiresAt");
    }
  };

  const logout = useCallback(async () => {
    try {
      await fetch("/api/sign-out", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      router.push("/sign-in");
    }
  }, [router]);

  const refreshAccessToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/refresh-token", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        const newToken = data.access_token;

        if (newToken !== previousToken.current) {
          previousToken.current = newToken;
          setAccessToken(newToken, data.expires_in);
        }
      } else {
        console.error("Failed to refresh token:", data.message);
        setAccessToken(null);
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAccessToken(null);
      router.push("/sign-in");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const savedToken = localStorage.getItem("accessToken");
      const savedExpiresAt = localStorage.getItem("expiresAt");

      if (savedToken && savedExpiresAt) {
        const now = Date.now();
        const expiryTime = Number(savedExpiresAt);

        if (now < expiryTime) {
          setAccessToken(savedToken, (expiryTime - now) / 1000);
        } else {
          await refreshAccessToken();
        }
      } else {
        await refreshAccessToken();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (accessToken && expiresAt) {
      const now = Date.now();
      const timeoutDuration = expiresAt - now - 10 * 1000;

      if (timeoutDuration > 0) {
        timer = setTimeout(refreshAccessToken, timeoutDuration);
      } else {
        refreshAccessToken();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [accessToken, expiresAt, refreshAccessToken]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "accessToken") {
        if (event.newValue) {
          setAccessToken(event.newValue);
        } else {
          setAccessToken(null);
          router.push("/sign-in");
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isLoading,
        isAuthenticated: !!accessToken,
        logout,
      }}
    >
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
