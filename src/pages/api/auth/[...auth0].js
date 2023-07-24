import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: "/home",
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE, // or AUTH0_AUDIENCE
        scope:
          "openid profile email read:current_user read:user_idp_tokens update:current_user_metadata", // or AUTH0_SCOPE
      },
    });
  },
  async logout(req, res) {
    await handleLogout(req, res, {
      returnTo: "/",
    });
  },
});
