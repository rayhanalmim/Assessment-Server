import express, { Request, Response, NextFunction } from 'express';
import { SmtpValidationService } from '../services/smtpValidationService';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

// Validate SMTP credentials
router.post('/validate', catchAsync(async (req: Request, res: Response): Promise<void> => {
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

  const result = await SmtpValidationService.validateSmtpCredentials(smtpSettings);

  res.status(result.success ? 200 : 400).json(result);
}));

// Test SMTP by sending an actual email
router.post('/test-email', catchAsync(async (req: Request, res: Response): Promise<void> => {
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

  const result = await SmtpValidationService.testSmtpWithEmail(smtpSettings, testEmail);

  res.status(result.success ? 200 : 400).json(result);
}));

export default router;