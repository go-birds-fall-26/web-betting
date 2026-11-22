const { getUserSession } = require("../services/userSessions");
const { SessionNotFoundError } = require("../errors/userSessionErrors");

let requestAuthorizer = async (req, res, next) => {
  let { token } = req.cookies;

  // user is already logged in
  if (token !== undefined) {

    try {

      let session = await getUserSession(token);
      req.session = {
        id: session.id,
        userId: session.user_id,
      };

    } catch (error) {

      if (error instanceof SessionNotFoundError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      } else {
        console.error("Unexpected error occurred while fetching user session: ", error);
        return res.status(500).json({
          error: "Internal server error"
        });
      }

    }
  }

  res.locals.isLoggedIn = Boolean(req.session && req.session.userId && req.session.id);
  next();
};

module.exports = { requestAuthorizer };
