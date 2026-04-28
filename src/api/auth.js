
export async function getAccessToken() {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const isProd =
    window.location.hostname === "uat-loyalty.lockated.com" ||
    window.location.hostname === "rustomjee-loyalty.lockated.com" ||
    window.location.hostname === "rustomjee-loyalty-dev.lockated.com";

  let env;
  if (isProd && !isLocal) {
    try {
      const prodModule = await import("/src/env.prod.js");
      env = prodModule.PROD_ENV;
    } catch (e) {
      console.error("Failed to load PROD_ENV from env.prod.js", e);
      throw new Error(
        "Production environment variables missing. Please check src/env.prod.js."
      );
    }
  } else {
    env = import.meta.env;
  }

  const baseUrl = env.VITE_SF_BASE_URL;
  const clientId = env.VITE_SF_CLIENT_ID;
  const clientSecret = env.VITE_SF_CLIENT_SECRET;
  const refreshToken = env.VITE_SF_REFRESH_TOKEN;

  if (!baseUrl || !clientId || !clientSecret || !refreshToken) {
    console.error(
      "Missing Salesforce environment variables.",
      { VITE_SF_BASE_URL: baseUrl, VITE_SF_CLIENT_ID: clientId }
    );
    throw new Error(
      "One or more Salesforce environment variables are missing. Check your .env or src/env.prod.js."
    );
  }

  const url = `${baseUrl}/services/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new Error(`Salesforce token request failed: ${response.status}`);
    }

    const data = await response.json();
    return data; // { access_token, instance_url, ... }
  } catch (err) {
    console.error("Error fetching Salesforce access token:", err);
    return null;
  }
}
