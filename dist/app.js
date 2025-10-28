"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const deployService_1 = require("./services/deployService");
const smtpRoutes_1 = __importDefault(require("./routes/smtpRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "https://emails-send.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true
}));
//applications route
app.use("/api/smtp", smtpRoutes_1.default);
// app.use("/api", AnimalRoute);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const contractAddress = await deployContract();
        res.status(200).send({ message: "server is running" });
    }
    catch (error) {
        res.status(500).send({ message: "Error deploying contract", error: error });
    }
}));
// Not Found Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.get("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contractAddress = yield (0, deployService_1.deployContract)();
        res.status(200).send({ message: "Contract deployed successfully", contractAddress });
    }
    catch (error) {
        res.status(500).send({ message: "Error deploying contract", error: error });
    }
}));
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
    });
});
console.log(process.cwd());
exports.default = app;
