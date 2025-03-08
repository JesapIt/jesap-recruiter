import { google } from 'googleapis';
import { readFileSync } from 'fs';
import path from 'path';

// Set up the Google Sheets API client
export const authenticateGoogleSheets = () => {
  // Path to the service account credentials JSON
  const credentials = JSON.parse(readFileSync(path.join(process.cwd(), 'credentials.json'), 'utf-8'));

  // Authenticate with the service account using the credentials
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};