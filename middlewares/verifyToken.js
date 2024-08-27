import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const headers = await req.headers;
    const token = headers.authorization;

    const authToken = token.split(" ")[1];

    if (!authToken) {
      res.status(404).json({ msg: "No token found", success: false });
      return;
    }
    jwt.verify(authToken, process.env.JWT_SEC, (err, data) => {
      if (err) {
        res.status(400).json({ msg: "Token Not valid", success: false });
        return;
      }
      req.user = data;
      next();
    });
  } catch (error) {
    console.log(error, "---error");

    res.status(500).json({
      success: false,
      message: "Internal server error from verify token",
    });
  }
};

export const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.params.id === req.user.id) {
        next();
      } else {
        res.status(403).json({ msg: "You are not allowed", success: false });
        return;
      }
    });
  } catch (error) {
    console.log(error, "---roor-");

    res.status(500).json({
      success: false,
      message: "Internal server error from verify token",
    });
  }
};
