const JWT = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const httpStatus = require("http-status");
const AdminModel = require("../models/adminModel");
const SuperAdmin = require("../models/superAdminModel")
const secretKey = process.env.JWT_SECRET || "Nit";


/**
 * Generates a JWT token based on the user data.
 * @param {Object} data - The user data.
 * @returns {string} - The generated JWT token.
 */
const getAuthToken = async (data) => {
  const { _id } = data;
  let token = JWT.sign({ id: _id }, secretKey);
  return token;
};

/**
 * Extracts JWT token from the Authorization header.
 * @param {Object} req - The request object.
 * @returns {string|null} - The extracted token, or null if missing.
 */
const extractToken = (req) => {
  const bearer = req.headers.authorization;
  if (bearer) {
    const splitting = bearer.split(" ");
    if (splitting.length === 2 && splitting[0] === "Bearer") {
      return splitting[1];
    }
  }
  return null;
};

/**
 * Verifies the JWT token and fetches user data from the model.
 * @param {string} token - The JWT token.
 * @param {Object} model - The user model to query.
 * @returns {Object|null} - The user data if token is valid, otherwise null.
 */
const verifyToken = async (token, model) => {
  try {
    const payload = JWT.verify(token, secretKey);
    const user = await model.findById(payload.id);
    if (user) {
      return { userId: payload.id, user };
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to verify JWT token and assign user ID to the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const verifyAuthToken = async (req, res, next) => {
  try {
    const token = extractToken(req); // Extract token from headers
    if (!token) {
      return res.status(401).send({ message: "Invalid or missing token" });
    }

    // Extract the second segment of the URL to determine the request source (admin/user/deliveryPerson)
    // const reqFrom = req.originalUrl.split("/")[2];

    // Dynamically assign the model based on the request source
    let model = null;
    switch (reqFrom) {
      case 'SuperAdmin':
        model = SuperAdmin;
        break;
      case 'Admin':
        model = AdminModel;
        break;
      // case 'deliveryPerson':
      //   model = DeliveryPersonModel;
      //   break;
      default:
        return res.status(400).send({ message: "Invalid request source" });
    }

    if (!model) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong, please try again');
    }

    // Verify the token and check if the user exists in the appropriate model
    const result = await verifyToken(token, model);
    if (!result) {
      return res.status(401).send({ message: "Invalid token or user" });
    }

    // Attach user ID to request object for further use in the route handler
    req._id = result.userId;
    next();
  } catch (error) {
    // Catch any unexpected errors and send a 500 response
    return res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

module.exports = { getAuthToken, verifyAuthToken };
