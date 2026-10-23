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
exports.SmtpValidationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class SmtpValidationService {
    /**
     * Validates SMTP credentials by attempting to create and verify a connection
     */
    static validateSmtpCredentials(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Input validation
                if (!settings.host || !settings.port || !settings.username || !settings.password) {
                    return {
                        success: false,
                        message: "Missing required SMTP credentials. Please provide host, port, username, and password."
                    };
                }
                // Create transporter with the provided settings
                const transporter = nodemailer_1.default.createTransport({
                    host: settings.host,
                    port: settings.port,
                    secure: settings.port === 465, // true for 465, false for other ports
                    auth: {
                        user: settings.username,
                        pass: settings.password,
                    },
                    // Additional security options
                    tls: {
                        // Don't fail on invalid certs for testing purposes
                        rejectUnauthorized: false,
                    },
                    // Connection timeout
                    connectionTimeout: 10000, // 10 seconds
                    greetingTimeout: 5000, // 5 seconds
                    socketTimeout: 10000, // 10 seconds
                });
                // Verify the connection
                const isValid = yield transporter.verify();
                if (isValid) {
                    return {
                        success: true,
                        message: `SMTP connection verified successfully! Ready to send emails via ${settings.host}:${settings.port}`,
                        details: {
                            host: settings.host,
                            port: settings.port,
                            secure: settings.port === 465,
                            username: settings.username
                        }
                    };
                }
                else {
                    return {
                        success: false,
                        message: "SMTP connection verification failed. Please check your credentials and try again."
                    };
                }
            }
            catch (error) {
                console.error('SMTP validation error:', error);
                // Parse common error messages to provide better user feedback
                let errorMessage = "SMTP connection failed. ";
                if (error.code === 'EAUTH') {
                    errorMessage += "Authentication failed. Please check your username and password.";
                }
                else if (error.code === 'ECONNECTION') {
                    errorMessage += "Connection failed. Please check your host and port settings.";
                }
                else if (error.code === 'ETIMEDOUT') {
                    errorMessage += "Connection timed out. Please check your host and port settings.";
                }
                else if (error.code === 'ENOTFOUND') {
                    errorMessage += "Host not found. Please check your SMTP host address.";
                }
                else if (error.code === 'ECONNREFUSED') {
                    errorMessage += "Connection refused. Please check your port number and firewall settings.";
                }
                else if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('Invalid login')) {
                    errorMessage += "Invalid login credentials. Please check your username and password.";
                }
                else if ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('authentication')) {
                    errorMessage += "Authentication error. Please verify your credentials.";
                }
                else {
                    errorMessage += `Error: ${error.message || 'Unknown error occurred'}`;
                }
                return {
                    success: false,
                    message: errorMessage,
                    details: {
                        errorCode: error.code,
                        errorMessage: error.message
                    }
                };
            }
        });
    }
    /**
     * Test sending an actual email to verify the SMTP configuration works end-to-end
     */
    static testSmtpWithEmail(settings, testEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First validate the connection
                const connectionResult = yield this.validateSmtpCredentials(settings);
                if (!connectionResult.success) {
                    return connectionResult;
                }
                // Create transporter
                const transporter = nodemailer_1.default.createTransport({
                    host: settings.host,
                    port: settings.port,
                    secure: settings.port === 465,
                    auth: {
                        user: settings.username,
                        pass: settings.password,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });
                // Send test email
                const mailOptions = {
                    from: `"${settings.fromName || 'Test'}" <${settings.username}>`,
                    to: testEmail,
                    subject: 'SMTP Configuration Test',
                    text: 'This is a test email to verify your SMTP configuration is working correctly.',
                    html: `
          <h2>SMTP Configuration Test</h2>
          <p>This is a test email to verify your SMTP configuration is working correctly.</p>
          <p><strong>SMTP Host:</strong> ${settings.host}</p>
          <p><strong>SMTP Port:</strong> ${settings.port}</p>
          <p><strong>Username:</strong> ${settings.username}</p>
          <p><em>If you received this email, your SMTP configuration is working properly!</em></p>
        `
                };
                const info = yield transporter.sendMail(mailOptions);
                return {
                    success: true,
                    message: `Test email sent successfully! Message ID: ${info.messageId}`,
                    details: {
                        messageId: info.messageId,
                        accepted: info.accepted,
                        rejected: info.rejected
                    }
                };
            }
            catch (error) {
                console.error('SMTP test email error:', error);
                return {
                    success: false,
                    message: `Failed to send test email: ${error.message || 'Unknown error'}`,
                    details: {
                        errorCode: error.code,
                        errorMessage: error.message
                    }
                };
            }
        });
    }
}
exports.SmtpValidationService = SmtpValidationService;
