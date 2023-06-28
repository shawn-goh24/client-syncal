import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function testing(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);

    // This is a contrived example, normally your external API would exist on another domain.
    const response = await fetch("http://localhost:8080/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log(accessToken);
    // const shows = await response.json();
    // res.status(response.status || 200).json(shows);
    // return shows;
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
});
