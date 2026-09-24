import express from "express";
import dotenv from 'dotenv';
import path from "path";
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"; // for reading the cookies

dotenv.config();
const app = express();
import cors from "cors";

// import data from the env
let PORT = process.env.PORT

// import routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

const __dirname = path.resolve();

// setup the cors
app.use(cors({
  origin : "http://localhost:5173", // accept client request from this
  credentials : true,   // allow frontend to send cookies
}));


// middlewares
app.use(express.json());
app.use(cookieParser());  // for cookie access
app.use("/avatars", express.static(path.join(process.cwd(), "assets/Avatars"))); // to serve static files (avatars)

// Backend API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// code for the deployment --> basically we serve our frontend from the backend
if(process.env.NODE_ENV === "production"){  //Check karo ki app production mode me chal rahi hai ya nahi.

  // Frontend ki static files serve karo.
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // har unknown route pe index.html file bhej do .
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

}

app.listen(PORT, () => {
  console.log("Server start listening on the port 5001");
  connectDB();
})