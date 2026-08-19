import { generateSQLiteFile, SQLITE_FILE_PATH, DB_FILE_PATH } from '../server/sqlite.js';

async function runExport() {
  console.log('🚀 Generating SQLite database files for DB Browser for SQLite...');
  try {
    const filePath = await generateSQLiteFile();
    console.log(`\n✅ SQLite Database Created Successfully!`);
    console.log(`📁 File 1 (.sqlite): ${SQLITE_FILE_PATH}`);
    console.log(`📁 File 2 (.db): ${DB_FILE_PATH}`);
    console.log(`\n💡 How to open in DB Browser for SQLite:`);
    console.log(` 1. Launch DB Browser for SQLite on your desktop.`);
    console.log(` 2. Click "Open Database".`);
    console.log(` 3. Select the file: data/careerai.sqlite (or data/careerai.db).`);
    console.log(` 4. Browse tables: 'users', 'resumes', 'analyses'.`);
  } catch (error) {
    console.error('❌ Failed to export SQLite database:', error);
  }
}

runExport();
