//API Documentation
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
//Pakege imports
import expreess from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
//Security part
import helmet from "helmet";
import xss from "xss-clean";
import mongoseSanitize from "express-mongo-sanitize";


//Files imports
import connectDB from './config/db.js';
//routes imports
import testRoutes from "./router/testRoute.js";
import authRoute from "./router/authRouter.js";
import errorMiddleware from './middlwares/errorMiddleware.js';
import jobRoutes from './router/jobsRoute.js';
import userRoutes from './router/userRoutes.js';





//config 
dotenv.config();
//mongodb connection 
connectDB();


//Swagger api config
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal Application',
      version: '1.0.0',
      description: "Node Express js Job Portal Application",
    },
    servers: [
      {
        url:"http://localhost:7000",
      },
    ],
  },
  apis: ["./router/*.js"], // Path to the API routes files
};

// Use the generated Swagger specification in your application

const spec = swaggerDoc(options);
//reset object
const app = expreess();



//Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'example.com'],
        // Add any other necessary directives
      },
    },
    referrerPolicy: { policy: 'origin' },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
    },
  })
);
app.use(xss());
app.use(mongoseSanitize());
app.use(expreess.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobRoutes);


//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
//Validation middleware
app.use(errorMiddleware);
//port 
const PORT = process.env.PORT || 7000


//Liste

app.listen(7000, () => {
    console.log(`Server is running in ${process.env.DEV_MODE} Mode on port number ${PORT}`.bgCyan.white);
});