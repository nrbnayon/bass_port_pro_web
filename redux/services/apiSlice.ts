// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout, updateTokens } from "../features/authSlice";

// Helper to clear cookies
const clearAuthCookies = () => {
  if (typeof document === "undefined") return;
  const cookiesToClear = [
    "refreshToken",
    "authSession",
    "userRole",
    "userEmail",
    "userName",
    "userPermissions",
    "reset_verified",
  ];
  cookiesToClear.forEach((name) => {
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

// ─── Custom Simple Mutex ──────────────────────────────────────────────────────
class Mutex {
  private mutex = Promise.resolve();
  private locked = false;

  isLocked() {
    return this.locked;
  }

  waitForUnlock() {
    return this.mutex;
  }

  acquire(): Promise<() => void> {
    let release: () => void = () => {};
    const newMutex = new Promise<void>((resolve) => {
      release = () => {
        this.locked = false;
        resolve();
      };
    });

    const currentMutex = this.mutex;
    this.mutex = currentMutex.then(() => newMutex).catch(() => newMutex);
    this.locked = true;

    return currentMutex.then(() => release);
  }
}

const mutex = new Mutex();

// ─── Auto-Refresh Wrapper ─────────────────────────────────────────────────────

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const responseData = refreshResult.data as RefreshTokenResponse;
          const newAccessToken = responseData.access_token;

          if (newAccessToken) {
            api.dispatch(
              updateTokens({
                accessToken: newAccessToken,
                tokenExpiresAt: responseData.expires_at,
              }),
            );

            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
            clearAuthCookies();
          }
        } else {
          api.dispatch(logout());
          clearAuthCookies();
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  // Define tag types for cache invalidation
  tagTypes: [
    "User", "Auth", "Dashboard", "Profile", "Settings", "AuditLogs",
    // BassInsight domain
    "Lakes", "LakeReviews", "LakeReports",
    "BassPorn", "MyCatches", "FavouriteCatches",
    "Reports", "MyReports",
    "Comments",
    "Contact", "MyContacts",
  ],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

export const {} = apiSlice;
