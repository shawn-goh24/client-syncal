import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";

export default handleAuth(
  {
    async login(req, res) {
      await handleLogin(req, res, {
        returnTo: "/home",
      });
    },
    async logout(req, res) {
      await handleLogout(req, res, {
        returnTo: "/",
      });
    },
  }
  // {
  //   login: handleLogin({
  //     authorizationParams: {
  //       audience: "https://api.example.com/products", // or AUTH0_AUDIENCE
  //       // Add the `offline_access` scope to also get a Refresh Token
  //       scope: "openid profile email read:products", // or AUTH0_SCOPE
  //     },
  //   }),
  // }
);
