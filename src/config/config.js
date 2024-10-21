const dotenv = require('dotenv');
const path = require('path');
const joi = require('joi');
const { url } = require('inspector');

dotenv.config({path: path.join(__dirname, "../../.env")})

const envVarSchema = joi.object()

.keys({
    PORT: joi.number().default(9999),
    MONGODB_URL: joi.string().required().description("Mongo DB url"),
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
    }
}