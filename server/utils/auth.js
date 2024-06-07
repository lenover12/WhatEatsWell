import jwt from "jsonwebtoken";

function getUserFromToken(req) {
  const { token } = req.cookies;
  if (!token) {
    throw new Error("Unauthorized");
  }
  const user = jwt.verify(token, process.env.JWT_SECRET);
  return user;
}

export { getUserFromToken };
