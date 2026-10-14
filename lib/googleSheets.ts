import { Member } from './types';

// Converts any standard Google Sheet link to a direct CSV Export URL
export function convertToGoogleSheetCsvUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Already CSV format
  if (trimmed.includes('format=csv') || trimmed.includes('output=csv')) {
    return trimmed;
  }

  // Standard edit URL format: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  }

  // Published to web format: https://docs.google.com/spreadsheets/d/e/{ID}/pubhtml
  if (trimmed.includes('/pubhtml')) {
    return trimmed.replace('/pubhtml', '/pub?output=csv');
  }

  return trimmed;
}

// Parse CSV text into array of rows
export function parseCsvRows(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  return lines.map(line => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  });
}

// Parse Google Sheets CSV into Member objects with Thai/English column detection
export function parseMembersFromCsv(csvText: string): Member[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());

  // Find column indexes
  const colIndex = {
    memberId: headers.findIndex(h => h.includes('memberid') || h.includes('รหัส') || h.includes('id')),
    fullName: headers.findIndex(h => h.includes('name') || h.includes('ชื่อ') || h.includes('fullname')),
    phone: headers.findIndex(h => h.includes('phone') || h.includes('เบอร์') || h.includes('tel')),
    points: headers.findIndex(h => h.includes('point') || h.includes('แต้ม') || h.includes('คะแนน')),
    dinoSpecies: headers.findIndex(h => h.includes('dino') || h.includes('สายพันธุ์') || h.includes('ไดโนเสาร์')),
    joinDate: headers.findIndex(h => h.includes('date') || h.includes('วัน')),
  };

  const members: Member[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || !row[0]) continue;

    const memberId = (colIndex.memberId !== -1 ? row[colIndex.memberId] : row[0]) || `NSM-${100 + i}`;
    const fullName = (colIndex.fullName !== -1 ? row[colIndex.fullName] : row[1]) || 'สมาชิก NSM';
    const phone = (colIndex.phone !== -1 ? row[colIndex.phone] : row[2]) || '';
    const pointsRaw = colIndex.points !== -1 ? row[colIndex.points] : row[3];
    const points = parseInt(pointsRaw?.replace(/[^0-9]/g, '') || '0', 10);
    const dinoSpeciesRaw = (colIndex.dinoSpecies !== -1 ? row[colIndex.dinoSpecies] : row[4]) || 'trex';
    const joinDate = (colIndex.joinDate !== -1 ? row[colIndex.joinDate] : row[5]) || new Date().toISOString().split('T')[0];

    let dinoSpecies: 'trex' | 'triceratops' | 'brachio' = 'trex';
    if (dinoSpeciesRaw.toLowerCase().includes('tri') || dinoSpeciesRaw.includes('ไทร')) dinoSpecies = 'triceratops';
    else if (dinoSpeciesRaw.toLowerCase().includes('brach') || dinoSpeciesRaw.includes('คอยาว')) dinoSpecies = 'brachio';

    members.push({
      memberId: memberId.trim(),
      fullName: fullName.trim(),
      phone: phone.replace(/[^0-9]/g, '').trim(),
      points: isNaN(points) ? 0 : points,
      dinoSpecies,
      dinoName: 'ไดโนเสาร์คู่ใจ',
      joinDate: joinDate.trim(),
      completedQuests: [],
    });
  }

  return members;
}

// Fetch Google Sheet data using our proxy API to avoid CORS issues
export async function fetchGoogleSheetMembers(sheetUrl: string): Promise<{ success: boolean; members?: Member[]; error?: string }> {
  try {
    const csvUrl = convertToGoogleSheetCsvUrl(sheetUrl);
    if (!csvUrl) {
      return { success: false, error: 'ลิงก์ Google Sheets ไม่ถูกต้อง' };
    }

    const response = await fetch(`/api/sheets?url=${encodeURIComponent(csvUrl)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'ไม่สามารถดึงข้อมูลจาก Google Sheets ได้' };
    }

    const members = parseMembersFromCsv(data.csv);
    return { success: true, members };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    return { success: false, error: message };
  }
}

// Ready-to-copy Google Apps Script template for 2-way sync
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// Google Apps Script สำหรับ NSM Member System
// วิธีใช้:
// 1. ไปที่ Google Sheets -> Extensions -> Apps Script
// 2. วางโค้ดนี้แทนที่โค้ดเดิมทั้งหมด
// 3. กด Deploy -> New Deployment -> Select type: Web app
// 4. ใครเข้าถึงได้ (Who has access): Anyone
// 5. นำ Web App URL ที่ได้ไปวางในระบบ NSM

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var members = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    members.push({
      memberId: String(row[0]),
      fullName: String(row[1]),
      phone: String(row[2]),
      points: Number(row[3]) || 0,
      dinoStage: String(row[4] || 'Egg Stage'),
      joinDate: String(row[5] || '')
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    members: members
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (body.action === 'updatePoints') {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.memberId)) {
          sheet.getRange(i + 1, 4).setValue(body.points);
          return ContentService.createTextOutput(JSON.stringify({ success: true }));
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Member not found' }));
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }));
  }
}
`;
