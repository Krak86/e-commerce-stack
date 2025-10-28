export type ErrorResponse = {
  message?: string;
  code?: number;
  details?: string[];
  isError?: boolean;
};

export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
} & ErrorResponse;
