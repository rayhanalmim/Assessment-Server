import express, { Application, Request, Response } from "express";
import cors from "cors";
import { AnimalRoute } from "./modules/Animal/animal.route";
import { deployContract } from "./services/deployService";
const app: Application = express();

app.use(express.json());
app.use(cors());

//applications route

app.use("/api", AnimalRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
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