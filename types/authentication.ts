export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  user_id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  expires_in: number;
  message: string;
  refresh_expires_in: number;
  refresh_token: string;
  token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  expires_in: number;
  message: string;
  refresh_expires_in: number;
  refresh_token: string;
  token: string;
}
