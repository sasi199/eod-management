const express = require('express');
const cors = require('cors');
const {status} = require('http-status');
const http = require('http');
const morgan = require('./src/config/morgan');
const routes = require("./src/routes/index");
const { authLimiter } = require('./src/middlewares/rateLimiter');
const socketIo = require('socket.io');
const { errorConverter, errorHandler } = require('./src/middlewares/error');
const path = require('path');
const ApiError = require('./src/utils/apiError');
const puppeteer = require("puppeteer");
const ejs = require('ejs');
const fs = require('fs');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Set up EJS as the view engine

console.log(path.join(__dirname, 'src/views'),'sdsdsfdgcvfs')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(cors());
app.options("*", cors());

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT", "DELETE"],
        credentials: true
      },
})

app.use((req, res, next) => {
    req.io = io;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        req.io.connectedUsers[userId] = socket.id;
    }

    socket.on("disconnect", () => {
        delete req.io.connectedUsers[userId];
    });
});


app.get("/",(req, res)=>{
    const data = {siteName : 'EOD Backend',message:null,siteLink:"http://localhost:5174"}
    res.status(200).render('siteWorking', data)
    // res.status(200).send({message:"EOD backend is working...🚀"})
})

async function generatePDF(htmlContent) {
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


app.get('/payslip', (req,res)=>{
    // const data = {
    //     companyName: "Your Company Name",
    //     companyLogo: "https://facesyncv1.s3.ap-south-1.amazonaws.com/candidate/37f6b674-1802-43ba-b002-7f30f7a0f599/ProfilePic.jpeg",
    //     companyAddress: "123, Business Street, City",
    //     salaryMonth:"06",
    //     salaryDate: "2024-06-01",
    //     employeeName: "John Doe",
    //     relationName: "Mark Doe",
    //     relationType: "Father",
    //     dateOfBirth: "1990-01-01",
    //     employeeNumber: "EMP001",
    //     accountNumber: "1234567890",
    //     department: "IT",
    //     designation: "Software Engineer",
    //     grade: "A",
    //     dateOfJoining: "2022-01-01",
    //     pfNumber: "PF123456",
    //     esiNumber: "ESI654321",
    //     salaryDays: 30,
    //     earnedDays: 30,
    //     compensatoryOff: 2,
    //     lossOfPayDays: 0,
    //     workingDays: 30,
    //     paidHolidays: 1,
    //     casualLeaveTaken: 1,
    //     sickLeaveTaken: 0,
    //     balanceLeave: 2,
    //     lateComings: 0,
    //     permissionsTaken: 0,
    //     basicSalaryEarned: 20000,
    //     houseRentAllowance: 5000,
    //     conveyance: 2000,
    //     otherAllowance: 3000,
    //     bonus: 1000,
    //     gratuity: 1000,
    //     pfContribution: 1500,
    //     esiContribution: 500,
    //     professionalTax: 200,
    //     transportDeduction: 0,
    //     otherDeductions: 100,
    //     totalEarnings: 31000,
    //     totalDeductions: 2300,
    //     netPay: 28700,
    //     basicSalary: 6543,
    // }
    const data = {
        // Company Details
        companyName: "Tech Innovations Ltd.",
        companyLogo: "https://facesync.app/wp-content/uploads/2024/02/FaceSync-white-background-02-1024x503.png",
        companyAddress: "123 Innovation Street, Tech City, TX 75001",
      
        // Date
        salaryDate: "2024-12-08", // yyyy-mm-dd format
      
        // Personal Details
        employeeName: "John Doe",
        relationName: "Jane Doe",
        relationType: "Spouse",
        dateOfBirth: "1990-05-15",
        employeeNumber: "EMP12345",
        accountNumber: "ACC987654321",
        department: "Software Development",
        designation: "Senior Developer",
        grade: "A",
        dateOfJoining: "2015-07-20",
        pfNumber: "PF123456789",
        esiNumber: "ESI123456",
      
        // Attendance Details
        salaryDays: 30,
        earnedDays: 30,
        compensatoryOff: 2,
        lossOfPayDays: 0,
        workingDays: 22,
        paidHolidays: 8,
      
        // Leave Details
        casualLeave: 10,
        sickLeave: 5,
        balanceLeave: 0,
        casualLeaveTaken: 2,
        sickLeaveTaken: 1,
        balanceLeaveUsed: 0,
        lateComings: 1,
        permissionsTaken: 0,
      
        // Salary Components
        basicSalaryEarned: 50000,
        basicSalary: 40000,
        houseRentAllowance: 8000,
        conveyance: 3000,
        otherAllowance: 2000,
        bonus: 5000,
        gratuity: 2000,
        grossSalary: 63000,
      
        // Deductions
        pfContribution: 4000,
        esiContribution: 1200,
        professionalTax: 150,
        transportDeduction: 500,
        otherDeductions: 200,
        pfEmployerContribution: 4000,
      
        // Total Summary
        totalEarnings: 63000,
        totalDeductions: 7900,
        netPay: 55100,
      }
    res.status(200).render('payslip',data)
})

app.get('/payslip/pdf', async (req, res) => {
    const paySlipData = {
        colorCode: "#531d6b",
        companyLogo: 'https://facesync.app/wp-content/uploads/2024/02/FaceSync-white-background-02-1024x503.png', // Path to your logo
        companyName: 'Facesync',
        companyLocation: 'Chennai, India',
        paySlipMonth: 'December 2024',
        employeeName: 'Gokul MG',
        designation: 'Full Stack Developer',
        employeeId: '12345',
        department: 'Web Developer',
        dateOfJoining: '01/01/2023',
        payDate: '07/12/2024',
        pfAccountNumber: 'AA/BBB/1234567/12C/123456',
        uan: '9876543210',
        casualLeaveAvailable: 1,
        casualLeaveUsed: 1,
        casualLeaveBalance: 0,
        sickLeaveAvailable: 1,
        sickLeaveUsed: 0,
        sickLeaveBalance: 1,
        balanceLeaveAvailable: 2,
        balanceLeaveUsed: 0,
        balanceLeaveBalance: 2,
        compOffAvailable: 2,
        compOffUsed: 1,
        compOffBalance: 1,
        totalLeaveBalance: 3,
        netPay: '₹15,000',
        paidDays: 30,
        lopDays: 0,
        balanceLeave: 3,
        basic: '₹8000',
        hra: '₹3000',
        conveyance: '₹2000',
        fixedAllowance: '₹5000',
        grossEarnings: '₹18000',
        epfContribution: '₹1000',
        professionalTax: '₹200',
        lopDeduction: '₹0',
        totalDeductions: '₹1200',
        totalNetPay: '₹16800',
        amountInWords: 'Sixteen Thousand Eight Hundred Rupees Only'
      };
    try {
      const htmlContent = await ejs.renderFile('./src/views/payslip.ejs',paySlipData);
  
      const pdfBuffer = await generatePDF(htmlContent);
        
    //   fs.writeFileSync("sample_payslip.pdf",pdfBuffer,)
      // Set headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=payslip.pdf');
  
      // Stream buffer
      res.write(pdfBuffer);
      res.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Failed to generate PDF');
    }
  });
// app.get('/payslip/pdf', async (req, res) => {
//     // Function to generate the PDF
//     async function generatePDF(htmlContent) {
//       const browser = await puppeteer.launch({ headless: true, timeout: 10000 }); // Set timeout
//       const page = await browser.newPage();
//       await page.setContent(htmlContent);
//       const pdf = await page.pdf();
//       await browser.close();
//       return pdf;
//     }
  
//     try {
//       // Render your EJS template
//       const htmlContent = await ejs.renderFile('./src/views/payslip.ejs', {
//         companyName: "Your Company Name",
//         companyLogo: "https://facesyncv1.s3.ap-south-1.amazonaws.com/candidate/37f6b674-1802-43ba-b002-7f30f7a0f599/ProfilePic.jpeg",
//         companyAddress: "123, Business Street, City",
//         salaryDate: "2024-06-01",
//         employeeName: "John Doe",
//         relationName: "Mark Doe",
//         relationType: "Father",
//         dateOfBirth: "1990-01-01",
//         employeeNumber: "EMP001",
//         accountNumber: "1234567890",
//         department: "IT",
//         designation: "Software Engineer",
//         grade: "A",
//         dateOfJoining: "2022-01-01",
//         pfNumber: "PF123456",
//         esiNumber: "ESI654321",
//         salaryDays: 30,
//         earnedDays: 30,
//         compensatoryOff: 2,
//         lossOfPayDays: 0,
//         workingDays: 30,
//         paidHolidays: 1,
//         casualLeaveTaken: 1,
//         sickLeaveTaken: 0,
//         balanceLeave: 2,
//         lateComings: 0,
//         permissionsTaken: 0,
//         basicSalaryEarned: 20000,
//         houseRentAllowance: 5000,
//         conveyance: 2000,
//         otherAllowance: 3000,
//         bonus: 1000,
//         gratuity: 1000,
//         pfContribution: 1500,
//         esiContribution: 500,
//         professionalTax: 200,
//         transportDeduction: 0,
//         otherDeductions: 100,
//         totalEarnings: 31000,
//         totalDeductions: 2300,
//         netPay: 28700
//       });
  
//       // Generate PDF using the rendered HTML content
//       const pdfBuffer = await generatePDF(htmlContent);
  
//       // Check if pdfBuffer is valid and not empty
//       if (!pdfBuffer || pdfBuffer.length === 0) {
//         throw new Error('Generated PDF buffer is empty.');
//       }
  
//       // Set the correct content type for PDF
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', 'inline; filename=payslip.pdf');
      
//       // Log the length of the PDF buffer (for debugging)
//       console.log(`Generated PDF buffer size: ${pdfBuffer.length}`);
  
//       // Send the PDF buffer as the response
//       res.send(pdfBuffer);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       res.status(500).send("Error generating PDF");
//     }
//   });

// app.get('/payslip/pdf', (req, res) => {
//     // Creating a valid minimal PDF buffer
//     const pdfBuffer = Buffer.from(
//       '%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n72 72 Td\n(Hello PDF) Tj\nET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF',
//       'utf-8'
//     );
  
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'inline; filename=test.pdf');
//     res.send(pdfBuffer);
//   });

app.use('/v1',routes);
app.use('/v1/auth',authLimiter);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(status.NOT_FOUND, "Not found"));
  });

app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = server;

