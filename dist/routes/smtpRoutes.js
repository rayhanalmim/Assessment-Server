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
const smtpValidationService_1 = require("../services/smtpValidationService");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const router = express_1.default.Router();
// Validate SMTP credentials
router.post('/validate', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, username, password, useTls, fromName } = req.body;
    // Validate required fields
    if (!host || !port || !username || !password) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields: host, port, username, password'
        });
        return;
    }
    const smtpSettings = {
        host,
        port: parseInt(port),
        username,
        password,
        useTls: useTls || false,
        fromName
    };
    const result = yield smtpValidationService_1.SmtpValidationService.validateSmtpCredentials(smtpSettings);
    res.status(result.success ? 200 : 400).json(result);
})));
// Test SMTP by sending an actual email
router.post('/test-email', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { host, port, username, password, useTls, fromName, testEmail } = req.body;
    // Validate required fields
    if (!host || !port || !username || !password || !testEmail) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields: host, port, username, password, testEmail'
        });
        return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
        res.status(400).json({
            success: false,
            message: 'Invalid test email format'
        });
        return;
    }
    const smtpSettings = {
        host,
        port: parseInt(port),
        username,
        password,
        useTls: useTls || false,
        fromName
    };
    const result = yield smtpValidationService_1.SmtpValidationService.testSmtpWithEmail(smtpSettings, testEmail);
    res.status(result.success ? 200 : 400).json(result);
})));
exports.default = router;
