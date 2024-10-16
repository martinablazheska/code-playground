import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
