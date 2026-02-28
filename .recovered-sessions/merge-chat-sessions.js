const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const home = process.env.HOME;
const targetWs = path.join(home, 'Library/Application Support/Code/User/workspaceStorage/67ff563ee0f565cc38bbab1b9b55e9bf');
const targetChat = path.join(targetWs, 'chatSessions');
const stateDb = path.join(targetWs, 'state.vscdb');

function sh(cmd) {
  return cp.execSync(cmd, { encoding: 'utf8' }).trim();
}

function q(str) {
  return `'${String(str).replace(/'/g, "''")}'`;
}

function runSql(dbPath, sql) {
  const tmpFile = path.join(targetWs, `.tmp-chat-recovery-${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, `${sql}\n`, 'utf8');
  try {
    cp.execSync(`sqlite3 ${q(dbPath)} < ${q(tmpFile)}`, { encoding: 'utf8' });
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

function parseSession(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n').filter(Boolean);
  let sessionId = path.basename(file, path.extname(file));
  let created = Date.now();
  let title = 'Recovered Chat';
  let lastMessageDate = 0;
  let requestsCount = 0;

  for (const line of lines) {
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }

    if (obj?.kind === 0 && obj?.v) {
      sessionId = obj.v.sessionId || sessionId;
      if (obj.v.creationDate) created = Number(obj.v.creationDate) || created;
      if (obj.v.customTitle) title = String(obj.v.customTitle);
    }

    if (obj?.kind === 1 && Array.isArray(obj?.k) && obj.k.length === 1 && obj.k[0] === 'customTitle' && obj.v) {
      title = String(obj.v);
    }

    if (obj?.kind === 2 && Array.isArray(obj?.k) && obj.k[0] === 'requests' && Array.isArray(obj?.v)) {
      requestsCount += obj.v.length;
      for (const req of obj.v) {
        if (req?.timestamp) lastMessageDate = Math.max(lastMessageDate, Number(req.timestamp) || 0);
      }
    }
  }

  if (!lastMessageDate) {
    lastMessageDate = Math.floor(Math.max(created, fs.statSync(file).mtimeMs));
  }

  return {
    sessionId,
    title,
    lastMessageDate,
    timing: { created: Math.floor(created) },
    initialLocation: 'panel',
    hasPendingEdits: false,
    isEmpty: requestsCount === 0,
    isExternal: false,
    lastResponseState: 1,
    sourceFile: file
  };
}

function ensureBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(targetWs, `session-recovery-backup-${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(stateDb, path.join(backupDir, 'state.vscdb.bak'));
  const stateDbBackup = `${stateDb}.backup`;
  if (fs.existsSync(stateDbBackup)) {
    fs.copyFileSync(stateDbBackup, path.join(backupDir, 'state.vscdb.backup.bak'));
  }
  const backupChatDir = path.join(backupDir, 'chatSessions');
  fs.mkdirSync(backupChatDir, { recursive: true });
  if (fs.existsSync(targetChat)) {
    for (const file of fs.readdirSync(targetChat)) {
      fs.copyFileSync(path.join(targetChat, file), path.join(backupChatDir, file));
    }
  }
  return backupDir;
}

function collectSources() {
  const sources = [];

  const emptyWindowDir = path.join(home, 'Library/Application Support/Code/User/globalStorage/emptyWindowChatSessions');
  if (fs.existsSync(emptyWindowDir)) {
    for (const f of fs.readdirSync(emptyWindowDir)) {
      if (f.endsWith('.jsonl')) sources.push(path.join(emptyWindowDir, f));
    }
  }

  const workspaceStorageRoot = path.join(home, 'Library/Application Support/Code/User/workspaceStorage');
  if (fs.existsSync(workspaceStorageRoot)) {
    for (const ws of fs.readdirSync(workspaceStorageRoot)) {
      const dir = path.join(workspaceStorageRoot, ws, 'chatSessions');
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith('.jsonl')) sources.push(path.join(dir, f));
      }
    }
  }

  return Array.from(new Set(sources));
}

function main() {
  const backupDir = ensureBackup();
  const sourceFiles = collectSources();
  fs.mkdirSync(targetChat, { recursive: true });

  const parsedSessions = [];
  let copiedToTarget = 0;

  for (const file of sourceFiles) {
    try {
      const meta = parseSession(file);
      parsedSessions.push(meta);
      const targetFile = path.join(targetChat, `${meta.sessionId}.jsonl`);
      if (!fs.existsSync(targetFile)) {
        fs.copyFileSync(file, targetFile);
        copiedToTarget += 1;
      }
    } catch {}
  }

  const raw = sh(`sqlite3 ${q(stateDb)} "select value from ItemTable where key='chat.ChatSessionStore.index';"`);
  let index;
  try {
    index = JSON.parse(raw);
  } catch {
    index = { version: 1, entries: {} };
  }

  if (!index.entries) index.entries = {};

  let addedToIndex = 0;
  for (const meta of parsedSessions) {
    if (!index.entries[meta.sessionId]) {
      const { sourceFile, ...entry } = meta;
      index.entries[meta.sessionId] = entry;
      addedToIndex += 1;
    }
  }

  const updated = JSON.stringify(index);
  runSql(stateDb, `update ItemTable set value=${q(updated)} where key='chat.ChatSessionStore.index';`);

  const result = {
    backupDir,
    sourceFiles: sourceFiles.length,
    parsedSessions: parsedSessions.length,
    copiedToTarget,
    addedToIndex,
    totalIndexEntries: Object.keys(index.entries).length
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
