import { getAccessToken, handleRefresh, logout } from "./actions";

export async function fetchAccessToken() {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    await logout();
    return;
  }

  const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
  const expiry = tokenPayload.exp;
  const now = Math.floor(Date.now() / 1000);

  if (now > expiry) {
    accessToken = await handleRefresh();

    if (!accessToken) {
      await logout();
    }
  }

  return accessToken;
}
