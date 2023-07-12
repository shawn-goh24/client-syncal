import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: "/home",
      authorizationParams: {
        audience: "https://syncal/api", // or AUTH0_AUDIENCE
        // Add the `offline_access` scope to also get a Refresh Token
        scope:
          "openid profile email read:current_user read:user_idp_tokens update:current_user_metadata", // or AUTH0_SCOPE
        // connection: "google-oauth2",
        // connection_scope:
        //   "https://www.googleapis.com/auth/calendar.events.readonly",
        // accessType: "offline",
        // redirect_uri: "http://localhost:3000/home",
      },
    });
  },
  async logout(req, res) {
    await handleLogout(req, res, {
      returnTo: "/",
    });
  },
});
