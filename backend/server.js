import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";

const startServer = async () => {
  const PORT = process.env.PORT || 6969;

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
};

startServer();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", UserRoutes);

app.use("/api/post", PostRoutes);

app.use ((req,res)=> {
  res.send ("Not found")
})
