import { jwtDecode } from "jwt-decode";
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from "@/types/authentication";
import Cookies from "js-cookie";

export class AuthenticationService {
  private static instance: AuthenticationService;
  private API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
  private tokenRefreshTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        credentials: "include", // Important for receiving cookies from server
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Login failed with status: ${response.status}`
        );
      }

      const data: LoginResponse = await response.json();

      // Store tokens with proper expiration times
      this.storeTokens(
        data.token,
        data.refresh_token,
        data.expires_in,
        data.refresh_expires_in
      );

      // Setup token refresh before expiration
      this.setupTokenRefresh(data.expires_in);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  public async register(request: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Registration failed with status: ${response.status}`
        );
      }

      const data: LoginResponse = await response.json();

      // Store tokens with proper expiration times
      this.storeTokens(
        data.token,
        data.refresh_token,
        data.expires_in,
        data.refresh_expires_in
      );

      // Setup token refresh before expiration
      this.setupTokenRefresh(data.expires_in);

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  public async refreshToken(
    refreshToken?: string
  ): Promise<RefreshTokenResponse> {
    try {
      // Use provided token or get from storage
      const token = refreshToken || this.getRefreshToken();

      if (!token) {
        throw new Error("No refresh token available");
      }

      const request: RefreshTokenRequest = { refresh_token: token };

      const response = await fetch(`${this.API_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed with status: ${response.status}`);
      }

      const data: RefreshTokenResponse = await response.json();

      // Store tokens with proper expiration times
      this.storeTokens(
        data.token,
        data.refresh_token,
        data.expires_in,
        data.refresh_expires_in
      );

      // Setup new token refresh timer
      this.setupTokenRefresh(data.expires_in);

      return data;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearTokens(); // Clear tokens on refresh failure
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      const accessToken = this.getAccessToken();

      await fetch(`${this.API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      this.clearTokens();
      this.clearTokenRefresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear tokens even if the server request fails
      this.clearTokens();
      this.clearTokenRefresh();
      throw error;
    }
  }

  public getAccessToken(): string | null {
    // Try to get token from cookie first (middleware can access this)
    const cookieToken = Cookies.get("access-token");
    if (cookieToken) return cookieToken;

    // Fall back to localStorage (client-side only)
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  public getRefreshToken(): string | null {
    // Try to get refresh token from cookie first
    const cookieToken = Cookies.get("refresh-token");
    if (cookieToken) return cookieToken;

    // Fall back to localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  public getUserFromToken(): User | null {
    try {
      const token = this.getRefreshToken();
      if (!token) return null;

      const decoded = jwtDecode<User & { exp: number }>(token);
      return {
        user_id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (error) {
      console.error("Failed to decode user from token:", error);
      return null;
    }
  }

  private storeTokens(
    token: string,
    refreshToken: string,
    tokenExpiresIn: number = 60, // Default: 60 seconds
    refreshExpiresIn: number = 120 // Default: 120 seconds
  ): void {
    if (typeof window === "undefined") return;

    // Store in localStorage for client-side access
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    // Calculate expiry dates (convert from seconds to milliseconds)
    const tokenExpiry = new Date(Date.now() + tokenExpiresIn * 1000);
    const refreshExpiry = new Date(Date.now() + refreshExpiresIn * 1000);

    // Store in cookies for middleware access
    const secure = process.env.NODE_ENV === "production";
    const sameSite = secure ? "strict" : "lax";

    // Set access token cookie
    Cookies.set("access-token", token, {
      secure,
      sameSite,
      path: "/",
      expires: tokenExpiry,
    });

    // Set refresh token cookie with longer expiration
    Cookies.set("refresh-token", refreshToken, {
      secure,
      sameSite,
      path: "/",
      expires: refreshExpiry,
    });
  }

  public clearTokens(): void {
    if (typeof window === "undefined") return;

    // Clear from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear cookies
    Cookies.remove("access-token", { path: "/" });
    Cookies.remove("refresh-token", { path: "/" });
  }

  private setupTokenRefresh(expiresIn: number): void {
    // Clear any existing refresh timeouts
    this.clearTokenRefresh();

    if (typeof window === "undefined") return;

    // Refresh 10 seconds before token expires or half the token lifetime, whichever is smaller
    const refreshDelay = Math.min(expiresIn - 10, expiresIn / 2) * 1000;

    // Set up a new timeout for token refresh
    this.tokenRefreshTimeout = setTimeout(async () => {
      try {
        if (this.isAuthenticated()) {
          await this.refreshToken();
          console.log("Token refreshed automatically");
        }
      } catch (error) {
        console.error("Failed to refresh token automatically:", error);
      }
    }, refreshDelay);
  }

  private clearTokenRefresh(): void {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
  }

  // Helper method to create authenticated fetch requests
  public async authenticatedFetch(
    url: string,
    options: RequestInit = {},
    onAuthFailure?: () => void
  ): Promise<Response> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const authOptions: RequestInit = {
      ...options,
      credentials: "include", // Important for cookies
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(url, authOptions);

      // If unauthorized, try to refresh token and retry
      if (response.status === 401) {
        try {
          await this.refreshToken();
          const newToken = this.getAccessToken();

          // Retry with new token
          authOptions.headers = {
            ...authOptions.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return fetch(url, authOptions);
        } catch (refreshError) {
          // If refresh fails, clear tokens and throw error
          this.clearTokens();
          this.clearTokenRefresh();

          // Call the onAuthFailure callback if provided
          if (onAuthFailure) {
            onAuthFailure();
          }

          throw new Error("Authentication expired. Please login again.");
        }
      }

      return response;
    } catch (error) {
      console.error("Authenticated fetch error:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = AuthenticationService.getInstance();
