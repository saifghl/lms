const fs = require('fs');
const path = require('path');

const backendDir = Object.freeze('c:/Users/Admin/Documents/lms-1/backend');
const scriptsDir = path.join(backendDir, 'scripts');
const outputFile = 'c:/Users/Admin/Documents/lms-1/db.sql';

let sqlContent = `-- Database Schema and Alterations Extracted\n\n`;

// 1. Add schema.sql first
const schemaFile = path.join(backendDir, 'schema.sql');
if (fs.existsSync(schemaFile)) {
    sqlContent += `-- ==========================================\n`;
    sqlContent += `-- FROM schema.sql\n`;
    sqlContent += `-- ==========================================\n\n`;
    sqlContent += fs.readFileSync(schemaFile, 'utf8') + '\n\n';
}

// 2. Read all JS files in backend and backend/scripts
let jsFiles = [];

const readJsFiles = (dir) => {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && item.endsWith('.js')) {
            jsFiles.push(fullPath);
        }
    }
};

readJsFiles(backendDir);
readJsFiles(scriptsDir);

// 3. Extract SQL queries from JS files
const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[^\`\'\"]+?(?:\([^]*?\)|;)/gi;
const alterTableRegex = /ALTER\s+TABLE\s+[^\`\'\"]+?(?:ADD|DROP|ALTER|RENAME|MODIFY)[\s\S]*?;/gi;
// We also want to match standard queries that might not easily parse if they use template literals
const rawQueryRegex = /(?:await\s+)?(?:db\.query|pool\.query|connection\.query)\s*\(\s*[\`\'\"]([\s\S]*?(?:CREATE\s+TABLE|ALTER\s+TABLE)[\s\S]*?)[\`\'\"]/gi;

jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let fileAdded = false;
    let fileSQL = '';

    // Match raw queries to capture full multiline SQL properly preserving syntax
    let match;
    while ((match = rawQueryRegex.exec(content)) !== null) {
        let query = match[1].trim();
        if(!query.endsWith(';')) query += ';';
        fileSQL += query + '\n\n';
        fileAdded = true;
    }

    if (!fileAdded) {
       // fallback if the rawQueryRegex didn't catch, try just finding snippets, though less reliable
       let match2;
       while ((match2 = createTableRegex.exec(content)) !== null) {
            let query = match2[0].trim();
            if(!query.endsWith(';')) query += ';';
            fileSQL += query + '\n\n';
            fileAdded = true;
       }
       while ((match2 = alterTableRegex.exec(content)) !== null) {
            let query = match2[0].trim();
            if(!query.endsWith(';')) query += ';';
            fileSQL += query + '\n\n';
            fileAdded = true;
       }
    }

    if (fileAdded) {
        const relPath = path.relative('c:/Users/Admin/Documents/lms-1', file);
        sqlContent += `-- ==========================================\n`;
        sqlContent += `-- FROM ${relPath}\n`;
        sqlContent += `-- ==========================================\n\n`;
        sqlContent += fileSQL + '\n';
    }
});

fs.writeFileSync(outputFile, sqlContent);
console.log('db.sql generated successfully at ' + outputFile);
