# Workflow Formula Compatibility Fix

## Context Files (READ FIRST)

1. **Rules**: https://github.com/steedos/steedos-platform/blob/2.7/docs/workflow-formula-rules.md
2. **Implementation**: `packages/@steedos-widgets/amis-lib/src/workflow/formula-utils.js`
3. **Caller**: `packages/@steedos-widgets/amis-lib/src/workflow/flow.js` (search `mapFormula`)
4. **Tests**: `packages/@steedos-widgets/amis-lib/src/workflow/__tests__/formula-utils.test.js`
5. **Fix history**: `packages/@steedos-widgets/amis-lib/docs/workflow/plan-001-formula-refactor.md`
6. **Fix history**: `packages/@steedos-widgets/amis-lib/docs/workflow/plan-002-static-value-fix.md`
7. **Human guide**: `packages/@steedos-widgets/amis-lib/docs/workflow/formula-bugfix-guide.md`

## Procedure

### Step 1: Analyze
- Determine: old formula input → current wrong output → expected correct output
- Read rules doc and formula-utils.js, locate root cause
- List related edge cases with same root cause

### Step 2: Write Failing Tests
- Append new `describe` block to test file
- Run tests to confirm new cases FAIL and old cases PASS:
```bash
cd packages/@steedos-widgets/amis-lib
npm install --no-save jest babel-jest @babel/core @babel/preset-env
npx jest --verbose
```

### Step 3: Fix Code
- Only modify `src/workflow/formula-utils.js`
- Do NOT modify `flow.js` unless import interface changes
- Minimal changes

### Step 4: Verify
- Run all tests again — ALL must pass:
```bash
npx jest --verbose
```

### Step 5: Document
- Create `docs/workflow/plan-NNN-[short-name].md` with: date, description, root cause, before/after table, changed files, test results

## Rules
- ❌ NEVER modify existing passing tests
- ❌ NEVER use real company names in code, tests, or docs — use generic placeholders
- ✅ ALWAYS write failing tests BEFORE fixing code
- ✅ ALWAYS run full test suite AFTER fixing
- ✅ Keep `formula-utils.js` as pure functions with zero external dependencies
- ✅ Update bug numbering table in `docs/workflow/formula-bugfix-guide.md`

## Bug Numbering
- Bugs 1-4: Plan 001
- Bug 5: Plan 002
- Next bug: **Bug 6**
