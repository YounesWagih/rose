export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo?: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
