const { PassThrough } = require("stream");
const csv = require("csv-parser");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { isBuffer } = require("util");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const ApiError = require("./apiError");
const httpStatus = require("http-status");
const { getData } = require("../config/json.config");
const { default: puppeteer } = require("puppeteer");
const secretKey = "weyduejdwewdnweudy";

class Utils {

  MONTHS = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

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
    const date = String(currentdate.getDate()).padStart(2, "0");
    const month = String(currentdate.getMonth() + 1).padStart(2, "0");
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
    return Array.from(
      { length },
      () => alphabet[crypto.randomInt(alphabet.length)]
    ).join("");
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
  readCSVFromBufferWithImage(buffer, fieldName) {
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
          return results.push(data);
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

  async sendEmail(fromEmail, subject, htmlData) {
    if (!fromEmail) {
      return { status: false, message: "Mail id is not provided" };
    }
    if (!htmlData) {
      return { status: false, message: "htmlData is not provided" };
    }

    const transport = nodemailer.createTransport({
      ...config.email.smtp,
    });

    const emailOption = {
      from: config.email.from,
      to: config.email.hrEmail,
      subject: subject,
      html: htmlData,
    };

    const isMailSent = await transport.sendMail(emailOption);
    console.log(isMailSent, "lllll");

    if (!isMailSent) {
      return { status: false, message: "Unable to sent the Email" };
    }
    return { status: true, message: "mail sent Successfully" };
  }

  verifyForgotPasswordToken = async (token, model) => {
    try {
      console.log(token, "token");

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
    const token = JWT.sign({ id }, secretKey, { expiresIn: "10m" });

    return token;
  };

  welcomeToken = async (id) => {
    const token = JWT.sign({ id }, secretKey, { expiresIn: "1h" });

    return token;
  };

  validateSchema = (data, schema) => {
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      console.error("Validation error:", errorMessages);
      return { status: false, errorMessages };
      // throw new ApiError(httpStatus.BAD_REQUEST, errorMessages);
    }
    return { status: true, message: "no error in given" };
  };

  generateOtp = (length) => {
    console.log(length, "otp digit");
    const min = Math.pow(10, length - 1); // Minimum value based on the length
    const max = Math.pow(10, length) - 1; // Maximum value based on the length

    const otp = crypto.randomInt(min, max + 1).toString(); // Generate a random OTP within the range and convert it to a string
    return "123456";
  };

  /**
   * Calculate the Haversine distance between two points on Earth (specified in decimal degrees).
   * @param {number} lat1 - Latitude of the first point.
   * @param {number} lon1 - Longitude of the first point.
   * @param {number} lat2 - Latitude of the second point.
   * @param {number} lon2 - Longitude of the second point.
   * @returns {number} - Distance in kilometers.
   */

  haversinDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  getStartAndEndDates(input) {
    const [month, year] = input.split("-").map(Number); // Split input and convert to numbers

    // Start of the month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // Month is zero-based

    // End of the month: Month + 1, day 0 gives the last day of the previous month
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  }

  getWorkingDays(month, year, isAlternateSaturday = true) {
    const salaryConfig = getData();
    let workingDays = 0; // Counter for working days
    let totalHolidays = 0; // Counter for holidays
  
    const zeroBasedMonth = month - 1;
  
    const startDate = new Date(year, zeroBasedMonth, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the current month
    const payDate = new Date(year, zeroBasedMonth, salaryConfig.payDate ?? 7);
  
    let saturdayCount = 0; // Track number of Saturdays in the month
  
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
      if (dayOfWeek === 0) {
        // Sundays are always holidays
        totalHolidays++;
        continue;
      }
  
      if (dayOfWeek === 6) {
        // Saturday logic
        saturdayCount++; // Increment Saturday count
  
        if (isAlternateSaturday) {
          // Only count 1st, 3rd, and 5th Saturdays as working days
          if (saturdayCount % 2 !== 0) {
            workingDays++; // Odd-numbered Saturdays (1st, 3rd, 5th) are working
          } else {
            totalHolidays++; // Even-numbered Saturdays are holidays
          }
        } else {
          // If alternate Saturdays are not working, count all Saturdays as holidays
          totalHolidays++;
        }
      } else {
        // Monday to Friday are always working days
        workingDays++;
      }
    }
  
    return {
      workingDays,
      holidays: totalHolidays,
      startDate,
      endDate,
      payDate,
    };
  }
  

  getCurrentMonthYear() {
    const currentDate = new Date();

    const month = String(currentDate.getMonth() ).padStart(2, "0"); // Month is 0-based
    console.log(month,"month")
    const year = currentDate.getFullYear();

    return { month, year };
  }

  formatDate(date, format = 'dd/mm/yyyy') {
    console.log(date,"date")
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  console.log(format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year)
    .replace('yy', year.toString().slice(2)),"dsds")

  return format
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year)
    .replace('yy', year.toString().slice(2));
}

numberToWords(num) {
  const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const scales = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero Rupees Only";

  let result = "";

  // Function to convert numbers below 1000 into words
  const getBelowThousand = (n) => {
      let str = "";
      if (n > 99) {
          str += ones[Math.floor(n / 100)] + " Hundred ";
          n %= 100;
      }
      if (n > 19) {
          str += tens[Math.floor(n / 10)] + " ";
          n %= 10;
      }
      if (n > 0) {
          str += ones[n] + " ";
      }
      return str.trim();
  };

  let integerPart = Math.floor(num);
  let fractionalPart = Math.round((num - integerPart) * 100); // Two decimal places (paise)
  let parts = [];
  let scaleIndex = 0;

  // Process the number for Indian numbering system
  while (integerPart > 0) {
      let chunk;
      if (scaleIndex === 0) {
          chunk = integerPart % 1000; // First group: 3 digits (thousands)
          integerPart = Math.floor(integerPart / 1000);
      } else {
          chunk = integerPart % 100; // Subsequent groups: 2 digits (lakhs, crores)
          integerPart = Math.floor(integerPart / 100);
      }
      if (chunk > 0) {
          parts.unshift(getBelowThousand(chunk) + (scales[scaleIndex] ? " " + scales[scaleIndex] : ""));
      }
      scaleIndex++;
  }

  result = parts.join(" ").trim() + " Rupees";

  // Add fractional part (paise) if any
  if (fractionalPart > 0) {
      result += " and " + getBelowThousand(fractionalPart) + " Paise";
  }

  return result + " Only";
}

generatePDF = async(htmlContent) => {
  const browser = await puppeteer.launch({
    headless: true, // Ensure Puppeteer runs in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Safe args for deployment
  });
  const page = await browser.newPage();

  // Set HTML content
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0', // Ensure all resources are loaded
  });

  // Generate PDF with explicit options
  const pdfBuffer = await page.pdf({
    format: 'A4', // Standard PDF format
    printBackground: true, // Include background styles
    omitBackground:true,
  //   margin: {
  //     top: '20px',
  //     bottom: '20px',
  //     left: '20px',
  //     right: '20px',
  //   },
  });

  await browser.close();
  return pdfBuffer;
}

}


module.exports = new Utils();
