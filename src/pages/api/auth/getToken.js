import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function getToken(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    // console.log(accessToken);

    // This is a contrived example, normally your external API would exist on another domain.
    // const response = await fetch("http://localhost:8080/user", {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // const shows = await response.json();
    res.status(accessToken.status || 200).json(accessToken);
    return { accessToken: accessToken };
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
});
