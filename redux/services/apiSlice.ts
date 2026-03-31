// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { logout, updateTokens } from '../features/authSlice';

// Helper to clear cookies
const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;
  const cookiesToClear = ["refreshToken", "authSession", "userRole", "userEmail", "userName", "userPermissions", "reset_verified"];
  cookiesToClear.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

interface RefreshTokenResponse {
  message: string;
  access_token: string;
  expires_in: number;
  expires_at: number;
}

// ─── Base Query ───────────────────────────────────────────────────────────────

const baseQuery = fetchBaseQuery({
  // The API base URL – endpoints already include /api/...
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Don't override Content-Type for FormData (browser sets it with boundary)
    if (!headers.get("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ─── Auto-Refresh Wrapper ─────────────────────────────────────────────────────

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const responseData = refreshResult.data as RefreshTokenResponse;
      const newAccessToken = responseData.access_token;

      if (newAccessToken) {
        api.dispatch(updateTokens({ accessToken: newAccessToken, tokenExpiresAt: responseData.expires_at }));


        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        clearAuthCookies();
      }
    } else {
      api.dispatch(logout());
      clearAuthCookies();
    }
  }

  return result;
};


// Create the base API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // Define tag types for cache invalidation
  tagTypes: ['User', 'Auth', 'Dashboard', 'Job', 'Application'],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

export const {} = apiSlice;
