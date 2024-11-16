const { PassThrough } = require('stream');
const csv = require('csv-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { isBuffer } = require('util');
const config = require('../config/config');
const nodemailer = require('nodemailer')
const JWT = require("jsonwebtoken");
const ApiError = require('./apiError');
const httpStatus = require('http-status');
const secretKey= "weyduejdwewdnweudy"

class Utils {
  /**
   * Creates a string with proper conjunction (e.g., "A, B, and C").
   * @param {string[]} wordsArray - An array of words or phrases.
   * @returns {string} - The formatted string with proper conjunction.
   */
  createStringWithProperConjunction(wordsArray = []) {
    if (wordsArray.length === 0) {
      return "";
    }

    if (wordsArray.length === 1) {
      return wordsArray[0];
    }

    const lastWord = wordsArray.pop();
    return `${wordsArray.join(", ")} and ${lastWord}`;
  }

  /**
   * Returns the current date in DD/MM/YYYY format.
   * @returns {string} - The formatted current date.
   */
  Currentdate() {
    const currentdate = new Date();
    const date = String(currentdate.getDate()).padStart(2, '0');
    const month = String(currentdate.getMonth() + 1).padStart(2, '0');
    const year = currentdate.getFullYear();
    return `${date}/${month}/${year}`;
  }

  /**
   * Generates a random password of 7 characters using alphabet.
   * @returns {string} - The generated random password.
   */
  RandomPassword() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const length = 7;
    return Array.from({ length }, () => alphabet[crypto.randomInt(alphabet.length)]).join('');
  }

  /**
   * Reads data from a CSV buffer and returns it as an array of objects.
   * @param {Buffer} buffer - The buffer of the CSV file.
   * @returns {Promise<Object[]>} - A promise that resolves to an array of objects where each object represents a row in the CSV.
   */
  readCSVFromBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = new PassThrough();

      // Create a readable stream from the buffer
      stream.end(buffer);

      // Pipe the stream through the CSV parser
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }
  /**
   * Reads data from a CSV buffer and image buffer and returns it as an array of objects.
   * @param {Buffer} buffer - The buffer of the CSV file.
   * @returns {Promise<Object[]>} - A promise that resolves to an array of objects where each object represents a row in the CSV.
   */
  readCSVFromBufferWithImage(buffer,fieldName) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = new PassThrough();

      // Create a readable stream from the buffer
      stream.end(buffer);

      // Pipe the stream through the CSV parser
      stream
        .pipe(csv())
        .on("data", (data) => {
          if (data[fieldName] && data[fieldName].length > 0) {
            console.log(isBuffer(data[fieldName]));
          }
          return results.push(data)
        })
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }

  /**
   * Hashes a given plain text password.
   * @param {string} password - The plain text password.
   * @returns {Promise<string>} - The hashed password.
   */
  async hashPassword(password) {
    const saltRounds = 10; // You can adjust the number of salt rounds for security
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param {string} password - The plain text password.
   * @param {string} hashedPassword - The hashed password.
   * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
   */
  async comparePassword(password, hashedPassword) {
    // console.log(await bcrypt.compare(password, hashedPassword),"bcrypt");
    
    return await bcrypt.compare(password, hashedPassword);
  }

  sendEmail(sendTo,subject,htmlData){

    if(!sendTo){
      return {status:false, message: "Mail id is not provided" }
    }
    if(!htmlData){
      return {status:false, message: "htmlData is not provided" }
    }

    const transport = nodemailer.createTransport({
      ...config.email.smtp
    });

    const emailOption = {
      from: config.email.smtp.auth.from,
      to: sendTo,
      subject: subject||"Mail from isthri kart",
      html: htmlData}

      const isMailSent =  transport.sendMail(emailOption);
      if (!isMailSent) {
        return {status:false, message: "Unable to sent the Email" };
      }
      return {status:true, message: "mail sent Successfully"};
  }

  verifyForgotPasswordToken = async (token, model) => {
    try {
      console.log(token,"token");
      
      const payload = JWT.verify(token, secretKey);
      const user = await model.findById(payload.id);
      if (user) {
        return payload.id;
      }
      return false;
    } catch (error) {
      return null;
    }
  };

  getForgotPasswordToken = async (id) => {

    const token = JWT.sign({ id }, secretKey, { expiresIn: '10m' });

    return token;
};


  welcomeToken = async (id) => {

    const token = JWT.sign({ id }, secretKey, { expiresIn: '1h' });

    return token;
};

validateSchema = (data, schema) => {
  const { error } = schema.validate(data, { abortEarly: false });
  
  if (error) {
      const errorMessages = error.details.map(e => ({
          field: e.path.join('.'),
          message: e.message
      }));
      console.error("Validation error:", errorMessages);
      return {status: false, errorMessages}
      // throw new ApiError(httpStatus.BAD_REQUEST, errorMessages);
  }
  return {status: true, message:"no error in given"}
}


generateOtp = (length) => {

  console.log(length,"otp digit")
  const min = Math.pow(10, length - 1); // Minimum value based on the length
  const max = Math.pow(10, length) - 1; // Maximum value based on the length

  const otp = crypto.randomInt(min, max + 1).toString(); // Generate a random OTP within the range and convert it to a string
  return "123456";
}


/**
 * Calculate the Haversine distance between two points on Earth (specified in decimal degrees).
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lon1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lon2 - Longitude of the second point.
 * @returns {number} - Distance in kilometers.
 */


haversinDistance = (lat1,lon1,lat2,lon2)=>{
  const toRad = (angle) =>(angle * Math.PI)/360

  const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

}

module.exports = new Utils();
