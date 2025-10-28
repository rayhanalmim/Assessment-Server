import express, { Application, Request, Response } from "express";
import cors from "cors";
import { deployContract } from "./services/deployService";
import smtpRoutes from "./routes/smtpRoutes";

const app: Application = express();

app.use(express.json());
app.use(cors({
  origin: [
    "https://emails-send.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));

//applications route
app.use("/api/smtp", smtpRoutes);

// app.use("/api", AnimalRoute);

app.get("/", async(req: Request, res: Response) => {
  try {
    // const contractAddress = await deployContract();
    res.status(200).send({ message: "server is running" });
  } catch (error) {
    res.status(500).send({ message: "Error deploying contract", error: error });
  }
});

// Not Found Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.get("/deploy", async (req, res) => {
  try {
    const contractAddress = await deployContract();
    res.status(200).send({ message: "Contract deployed successfully", contractAddress });
  } catch (error) {
    res.status(500).send({ message: "Error deploying contract", error: error });
  }
});

app.use((err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
});

console.log(process.cwd());

export default app;