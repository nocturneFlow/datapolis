import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authentication";
import { User } from "@/types/authentication";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Token refresh error handler to redirect user to login
  const handleRefreshError = () => {
    setUser(null);
    router.push("/login");
  };

  // Check authentication status and extract user from token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated via token
        const isAuthenticated = authService.isAuthenticated();

        if (isAuthenticated) {
          try {
            // Load user from the token
            const userFromToken = authService.getUserFromToken();

            if (userFromToken) {
              setUser(userFromToken);
            } else {
              // If we can't get user data from token, try to refresh
              try {
                const response = await authService.refreshToken();
                // After refresh, try to get user data again
                const refreshedUserData = authService.getUserFromToken();
                if (refreshedUserData) {
                  setUser(refreshedUserData);
                } else {
                  throw new Error("Failed to get user data");
                }
              } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                handleRefreshError();
              }
            }
          } catch (error) {
            console.error("Failed to get user data:", error);
            handleRefreshError();
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        handleRefreshError();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ username, password });

      // Get user from the token
      const userFromToken = authService.getUserFromToken();
      if (!userFromToken) {
        throw new Error("Failed to get user data from token");
      }

      setUser(userFromToken);

      // Get the fromPath from localStorage if it exists
      const fromPath = localStorage.getItem("fromPath") || "/renovation";
      localStorage.removeItem("fromPath"); // Clean up

      router.push(fromPath);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if server-side logout fails, clear local tokens
      authService.clearTokens();
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
