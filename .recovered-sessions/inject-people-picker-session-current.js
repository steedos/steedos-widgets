const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const home = process.env.HOME;
const wsHash = '67ff563ee0f565cc38bbab1b9b55e9bf';
const wsDir = path.join(home, 'Library/Application Support/Code/User/workspaceStorage', wsHash);
const chatDir = path.join(wsDir, 'chatSessions');
const db = path.join(wsDir, 'state.vscdb');
const md = '/Users/yinlianghui/Documents/GitHub/steedos-widgets/.recovered-sessions/people-picker-mobile-session-recovery-2026-02-25.md';

if (!fs.existsSync(md)) throw new Error('markdown not found');

function q(str){ return `'${String(str).replace(/'/g, "''")}'`; }
function runSql(sql){
  const tmp = path.join(wsDir, `.tmp-inject-${Date.now()}.sql`);
  fs.writeFileSync(tmp, `${sql}\n`, 'utf8');
  try { cp.execSync(`sqlite3 ${q(db)} < ${q(tmp)}`); }
  finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
function sqlGet(key){
  return cp.execSync(`sqlite3 ${q(db)} "select value from ItemTable where key=${q(key)};"`, {encoding:'utf8'}).trim();
}

fs.mkdirSync(chatDir, {recursive:true});

const sessionId = 'recovered-people-picker-mobile-2026-02-25';
const title = 'Recovered: 选人选组优化（文档版）';
const now = Date.now();
const content = fs.readFileSync(md, 'utf8');

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
      customTitle: title,
      inputState: {
        attachments: [],
        mode: { id: 'agent', kind: 'agent' },
        inputText: '',
        selections: [{ startLineNumber:1,startColumn:1,endLineNumber:1,endColumn:1,selectionStartLineNumber:1,selectionStartColumn:1,positionLineNumber:1,positionColumn:1 }],
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
      message: { text: '恢复 people-picker 会话上下文', parts: [{ kind:'text', text:'恢复 people-picker 会话上下文' }] },
      response: [{ value: content, supportThemeIcons: false, supportHtml: false }],
      result: { timings: { firstProgress: 1, totalElapsed: 1 } }
    }]
  })
].join('\n') + '\n';

const sessionFile = path.join(chatDir, `${sessionId}.jsonl`);
fs.writeFileSync(sessionFile, jsonl, 'utf8');

let idx = {version:1, entries:{}};
try { idx = JSON.parse(sqlGet('chat.ChatSessionStore.index')); } catch {}
if (!idx.entries) idx.entries = {};
idx.entries[sessionId] = {
  sessionId,
  title,
  lastMessageDate: now,
  timing: { created: now },
  initialLocation: 'panel',
  hasPendingEdits: false,
  isEmpty: false,
  isExternal: false,
  lastResponseState: 1,
};
runSql(`update ItemTable set value=${q(JSON.stringify(idx))} where key='chat.ChatSessionStore.index';`);

const check = JSON.parse(sqlGet('chat.ChatSessionStore.index'));
console.log(JSON.stringify({
  injected: true,
  sessionFile,
  existsInIndex: !!check.entries?.[sessionId],
  totalEntries: Object.keys(check.entries || {}).length
}, null, 2));
