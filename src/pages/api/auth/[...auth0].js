import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: "/home",
      authorizationParams: {
        audience: "https://syncal/api", // or AUTH0_AUDIENCE
        // Add the `offline_access` scope to also get a Refresh Token
        scope:
          "openid profile email read:current_user update:current_user_metadata", // or AUTH0_SCOPE
      },
    });
  },
  async logout(req, res) {
    await handleLogout(req, res, {
      returnTo: "/",
    });
  },
});
