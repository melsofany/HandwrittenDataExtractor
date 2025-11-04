import { google } from 'googleapis';
import type { ExtractedRecord } from '@shared/schema';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export async function createGoogleSheet(
  records: ExtractedRecord[],
  sheetName?: string
): Promise<{ sheetUrl: string; sheetId: string }> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // Create a new spreadsheet
    const title = sheetName || `بيانات مستخرجة - ${new Date().toLocaleDateString('ar-EG')}`;
    
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
          locale: 'ar',
        },
        sheets: [
          {
            properties: {
              title: 'البيانات المستخرجة',
              gridProperties: {
                frozenRowCount: 1,
              },
            },
          },
        ],
      },
    });

    const spreadsheetId = createResponse.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    // Prepare the data
    const headers = ['الاسم الكامل', 'الرقم القومي'];
    const rows = records.map(record => [record.name, record.nationalId]);
    const values = [headers, ...rows];

    // Write data to the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'البيانات المستخرجة!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    // Format the header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.5,
                    blue: 0.8,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    fontSize: 12,
                    bold: true,
                  },
                  horizontalAlignment: 'RIGHT',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 2,
              },
            },
          },
        ],
      },
    });

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    
    return {
      sheetUrl,
      sheetId: spreadsheetId,
    };
  } catch (error) {
    console.error('Error creating Google Sheet:', error);
    throw new Error(`فشل في إنشاء Google Sheet: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
}
