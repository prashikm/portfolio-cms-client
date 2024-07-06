"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleRefresh() {
  const refreshToken = await getRefreshToken();

  const token = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/token/refresh`,
    {
      method: "POST",
      body: JSON.stringify({
        refresh: refreshToken,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.access) {
        cookies().set("session_access_token", json.access, {
          httpOnly: true,
          secure: false,
          maxAge: 60 * 60, // 60 minutes
          path: "/",
        });

        return json.access;
      } else {
        logout();
      }
    })
    .catch((error) => {
      console.log("error", error);
      logout();
    });

  return token;
}

export async function handleLogin(
  userMetadata: string,
  accessToken: string,
  refreshToken: string
) {
  cookies().set("session_user", userMetadata, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // one week
    path: "/",
  });

  cookies().set("session_access_token", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60, // 60 minutes
    path: "/",
  });

  cookies().set("session_refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  return redirect(`/${JSON.parse(userMetadata).username}`);
}

export async function logout() {
  cookies().set("session_user", "");
  cookies().set("session_access_token", "");
  cookies().set("session_refresh_token", "");

  return redirect("/login");
}

export async function getUser() {
  const user = cookies().get("session_user")?.value;
  return user ? JSON.parse(user) : null;
}

export async function getAccessToken() {
  let accessToken = cookies().get("session_access_token")?.value;

  if (!accessToken) {
    accessToken = await handleRefresh();
  }

  return accessToken;
}

export async function getRefreshToken() {
  let refreshToken = cookies().get("session_refresh_token")?.value;

  return refreshToken;
}
