export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
  };
  message: string;
}
