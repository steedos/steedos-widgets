const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const home = process.env.HOME;
const wsRoot = path.join(home, 'Library/Application Support/Code/User/workspaceStorage');
const sourceDirs = [
  path.join(home, 'Library/Application Support/Code/User/globalStorage/emptyWindowChatSessions'),
  ...fs.readdirSync(wsRoot).map(d => path.join(wsRoot, d, 'chatSessions'))
];

function q(str) {
  return `'${String(str).replace(/'/g, "''")}'`;
}

function runSql(dbPath, sql) {
  const tmpFile = path.join(path.dirname(dbPath), `.tmp-sync-${Date.now()}-${Math.random().toString(16).slice(2)}.sql`);
  fs.writeFileSync(tmpFile, `${sql}\n`, 'utf8');
  try {
    cp.execSync(`sqlite3 ${q(dbPath)} < ${q(tmpFile)}`, { stdio: 'pipe' });
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

function getSqlValue(dbPath, key) {
  try {
    return cp.execSync(`sqlite3 ${q(dbPath)} "select value from ItemTable where key=${q(key)};"`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function hasIndexKey(dbPath) {
  try {
    const out = cp.execSync(`sqlite3 ${q(dbPath)} "select count(1) from ItemTable where key='chat.ChatSessionStore.index';"`, { encoding: 'utf8' }).trim();
    return out === '1';
  } catch {
    return false;
  }
}

function parseSession(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n').filter(Boolean);
  let sessionId = path.basename(file, '.jsonl');
  let created = Date.now();
  let title = 'Recovered Chat';
  let last = 0;
  let reqCount = 0;

  for (const line of lines) {
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    if (obj?.kind === 0 && obj?.v) {
      sessionId = obj.v.sessionId || sessionId;
      if (obj.v.creationDate) created = Number(obj.v.creationDate) || created;
      if (obj.v.customTitle) title = String(obj.v.customTitle);
    }
    if (obj?.kind === 1 && Array.isArray(obj?.k) && obj.k[0] === 'customTitle' && obj.v) {
      title = String(obj.v);
    }
    if (obj?.kind === 2 && Array.isArray(obj?.k) && obj.k[0] === 'requests' && Array.isArray(obj?.v)) {
      reqCount += obj.v.length;
      for (const r of obj.v) {
        if (r?.timestamp) last = Math.max(last, Number(r.timestamp) || 0);
      }
    }
  }

  if (!last) last = Math.floor(Math.max(created, fs.statSync(file).mtimeMs));

  return {
    sessionId,
    title,
    lastMessageDate: Math.floor(last),
    timing: { created: Math.floor(created) },
    initialLocation: 'panel',
    hasPendingEdits: false,
    isEmpty: reqCount === 0,
    isExternal: false,
    lastResponseState: 1,
  };
}

function collectSourceFiles() {
  const files = [];
  for (const dir of sourceDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.jsonl')) files.push(path.join(dir, file));
    }
  }
  return Array.from(new Set(files));
}

function getTargetWorkspaces() {
  const targets = [];
  for (const hash of fs.readdirSync(wsRoot)) {
    const wsDir = path.join(wsRoot, hash);
    const db = path.join(wsDir, 'state.vscdb');
    const copilotDir = path.join(wsDir, 'GitHub.copilot-chat');
    if (!fs.existsSync(db)) continue;
    if (!fs.existsSync(copilotDir)) continue;
    if (!hasIndexKey(db)) continue;
    targets.push(wsDir);
  }
  return targets;
}

function ensurePeoplePickerSessionInTarget(targetDir) {
  const markdownPath = '/Users/yinlianghui/Documents/GitHub/steedos-widgets/.recovered-sessions/people-picker-mobile-session-recovery-2026-02-25.md';
  if (!fs.existsSync(markdownPath)) return null;

  const sessionId = 'recovered-people-picker-mobile-2026-02-25';
  const now = Date.now();
  const content = fs.readFileSync(markdownPath, 'utf8');
  const jsonl = [
    JSON.stringify({
      kind: 0,
      v: {
        version: 3,
        creationDate: now,
        initialLocation: 'panel',
        responderUsername: 'GitHub Copilot',
        sessionId,
        hasPendingEdits: false,
        requests: [],
        pendingRequests: [],
        customTitle: 'Recovered: 选人选组优化（文档版）',
        inputState: {
          attachments: [],
          mode: { id: 'agent', kind: 'agent' },
          inputText: '',
          selections: [{ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1, selectionStartLineNumber: 1, selectionStartColumn: 1, positionLineNumber: 1, positionColumn: 1 }],
          contrib: { chatDynamicVariableModel: [] }
        }
      }
    }),
    JSON.stringify({
      kind: 2,
      k: ['requests'],
      v: [{
        requestId: `request_${sessionId}`,
        timestamp: now,
        modelId: 'copilot/recovered',
        responseId: `response_${sessionId}`,
        modelState: { value: 1, completedAt: now },
        message: {
          text: '恢复 people-picker 会话上下文',
          parts: [{ kind: 'text', text: '恢复 people-picker 会话上下文' }]
        },
        response: [{ value: content, supportThemeIcons: false, supportHtml: false }],
        result: { timings: { firstProgress: 1, totalElapsed: 1 } }
      }]
    })
  ].join('\n') + '\n';

  const targetChat = path.join(targetDir, 'chatSessions');
  fs.mkdirSync(targetChat, { recursive: true });
  const targetFile = path.join(targetChat, `${sessionId}.jsonl`);
  if (!fs.existsSync(targetFile)) fs.writeFileSync(targetFile, jsonl, 'utf8');

  return {
    sessionId,
    title: 'Recovered: 选人选组优化（文档版）',
    lastMessageDate: now,
    timing: { created: now },
    initialLocation: 'panel',
    hasPendingEdits: false,
    isEmpty: false,
    isExternal: false,
    lastResponseState: 1,
  };
}

function mergeIntoTarget(targetDir, sourceFiles) {
  const db = path.join(targetDir, 'state.vscdb');
  const targetChat = path.join(targetDir, 'chatSessions');
  fs.mkdirSync(targetChat, { recursive: true });

  const raw = getSqlValue(db, 'chat.ChatSessionStore.index');
  let index;
  try { index = JSON.parse(raw); } catch { index = { version: 1, entries: {} }; }
  if (!index.entries) index.entries = {};

  let copied = 0;
  let addedIndex = 0;
  for (const file of sourceFiles) {
    let meta;
    try { meta = parseSession(file); } catch { continue; }

    const targetFile = path.join(targetChat, `${meta.sessionId}.jsonl`);
    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(file, targetFile);
      copied += 1;
    }

    if (!index.entries[meta.sessionId]) {
      index.entries[meta.sessionId] = meta;
      addedIndex += 1;
    }
  }

  const manual = ensurePeoplePickerSessionInTarget(targetDir);
  if (manual && !index.entries[manual.sessionId]) {
    index.entries[manual.sessionId] = manual;
    addedIndex += 1;
  }

  runSql(db, `update ItemTable set value=${q(JSON.stringify(index))} where key='chat.ChatSessionStore.index';`);

  return {
    target: path.basename(targetDir),
    copied,
    addedIndex,
    totalEntries: Object.keys(index.entries).length,
  };
}

function backupTarget(targetDir) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(targetDir, `session-recovery-backup-sync-${ts}`);
  fs.mkdirSync(backup, { recursive: true });
  const db = path.join(targetDir, 'state.vscdb');
  fs.copyFileSync(db, path.join(backup, 'state.vscdb.bak'));
  const dbBak = `${db}.backup`;
  if (fs.existsSync(dbBak)) fs.copyFileSync(dbBak, path.join(backup, 'state.vscdb.backup.bak'));
  return backup;
}

function main() {
  const targets = getTargetWorkspaces();
  const sourceFiles = collectSourceFiles();

  const results = [];
  for (const target of targets) {
    const backup = backupTarget(target);
    const r = mergeIntoTarget(target, sourceFiles);
    r.backup = backup;
    results.push(r);
  }

  process.stdout.write(JSON.stringify({
    targets: targets.map(t => path.basename(t)),
    sourceFiles: sourceFiles.length,
    results,
  }, null, 2) + '\n');
}

main();
