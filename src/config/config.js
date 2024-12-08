const dotenv = require('dotenv');
const path = require('path');
const joi = require('joi');
const { url } = require('inspector');

dotenv.config({path: path.join(__dirname, "../../.env")})

const envVarSchema = joi.object()

.keys({
    PORT: joi.number().default(9999),
    MONGODB_URL: joi.string().required().description("Mongo DB url"),
    JWT_SECRET: joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi.number()
      .default(43200)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    ZEPTO_HOST: joi.string().description("server that will send the emails"),
    SMTP_PORT: joi.number().description("port to connect to the email server"),
    ZEPTO_USER: joi.string().description("username for email server"),
    ZEPTO_PASS: joi.string().description("password for email server"),
    EMAIL_FROM: joi.string().description("the from field in the emails sent by the app"),
    COMPANY_LOCAT_1_LAT: joi.number().required().description("Latitude of company location 1"),
    COMPANY_LOCAT_1_LONG: joi.number().required().description("Latitude of company location 1"),
    COMPANY_LOCAT_2_LAT: joi.number().required().description("Latitude of company location 2"),
    COMPANY_LOCAT_2_LONG: joi.number().required().description("Latitude of company location 2"),
    LOCATION_RADIUS: joi.number().default(100).description('Allowed login radius in meters')
}).unknown();


const { value: envVars, error } = envVarSchema
.prefs({errors:{label: "key" }})
.validate(process.env);

if (error) {
    throw new Error(`Config validation error :${error.message}`);
}


module.exports = {
    port: envVars.PORT,
    mongoose: {
        url:envVars.MONGODB_URL
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes:
          envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
      },
      email: {
        smtp: {
          host: envVars.ZEPTO_HOST,
          port: envVars.SMTP_PORT,
          auth: {
            user: envVars.ZEPTO_USER,
            pass: envVars.ZEPTO_PASS,
          },
        },
        from: envVars.EMAIL_FROM,
        hrEmail: "elangaivendhan24@gmail.com",
      },
      cloudCred : {
        accessKeyId :  envVars.ACCESS_KEY_ID,
        secretAccessKey :  envVars.SECRET_ACCESS_KEY,
        region : envVars.REGION,
        awsEndPoint: envVars.AWS_ENDPOINT,
      },
      companyLocations:[
        { latitude:  parseFloat(envVars.COMPANY_LOCAT_1_LAT),longitude: parseFloat(envVars.COMPANY_LOCAT_1_LONG)},
        { latitude:  parseFloat(envVars.COMPANY_LOCAT_2_LAT),longitude: parseFloat(envVars.COMPANY_LOCAT_2_LONG)},
      ],
      locationRadius: envVars.LOCATION_RADIUS
      
}