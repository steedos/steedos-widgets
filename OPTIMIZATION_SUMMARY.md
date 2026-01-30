# Liquid Component Performance Optimization

## Issue
用户在输入过程中可能会出现页面闪烁, amis丢失问题 (Users experience page flickering and amis component loss during input when there are too many amis components in liquid templates)

## Root Cause
The `AmisSteedosField` component regenerates field schemas on every render without any caching mechanism. This causes:
1. Redundant async operations during user input
2. Page flickering when many fields need to regenerate
3. Loss of component state during re-rendering
4. Poor user experience during form editing

## Solution
Implemented a smart caching mechanism in `AmisSteedosField` component that selectively caches field schemas.

### What Gets Cached
✅ **Form input field schemas** - These are configuration-dependent and safe to cache:
- Text, number, date, select, and other input fields
- Fields without runtime data dependencies
- Most common use case during form editing

### What Doesn't Get Cached
❌ **Data-dependent schemas** - Skip caching for schemas that depend on record data:
- Static display fields with `_display` data
- Fields showing specific record values

❌ **Responsive schemas** - Skip caching for window-size dependent fields:
- Lookup fields (use `window.innerWidth` for responsive behavior)
- Master-detail fields

❌ **Editor mode** - Skip caching for real-time preview:
- Fields in builder/editor mode (`$$editor` prop)

### Cache Key Components
The cache key includes all properties that affect schema generation:
- Field configuration: `object`, `name`, `type`, `options`, `reference_to`
- Display properties: `label`, `readonly`, `className`
- Context: `appId`, `formFactor`, `objectName`, `ctx`
- Mode flags: `fStatic`, `inInputTable`, `isLookupInTable`
- Data presence: `_display` flag

### Error Handling
- Failed schema generation removes the cache entry
- Ensures transient errors don't become permanent
- Next request will retry schema generation

### Cache Management
- Maximum cache size: 1000 entries
- LRU-like eviction: removes oldest 20% when limit exceeded
- Manual clearing: `clearFieldSchemaCache()` function exported

## Performance Impact

### Before
- Every keystroke triggers full schema regeneration for all visible fields
- Complex async operations block rendering
- Page flickers as components unmount/remount
- Component state is lost

### After
- Cached schemas return immediately (no async operations)
- Only uncached or modified fields regenerate
- Page remains stable during input
- Component state is preserved

## Usage

### Normal Usage
No changes needed - caching is automatic and transparent.

### Manual Cache Clearing
If field definitions change at runtime:

```javascript
import { clearFieldSchemaCache } from '@steedos-widgets/amis-object';

// Clear cache when field definitions change
clearFieldSchemaCache();
```

## Files Modified
- `packages/@steedos-widgets/amis-object/src/amis/AmisSteedosField.tsx`
  - Added `fieldSchemaCache` Map for caching
  - Added `generateFieldCacheKey()` function with smart logic
  - Added `maintainCacheSize()` for cache management
  - Wrapped implementation with caching logic
  - Exported `clearFieldSchemaCache()` utility

## Testing Recommendations
1. Test form editing with many fields - verify no flickering during typing
2. Test static display mode - verify correct data shows for each record
3. Test lookup fields - verify responsive behavior on window resize
4. Test editor mode - verify real-time updates work correctly
5. Test error scenarios - verify failed schemas can be retried

## Security Considerations
✅ No security concerns - caching is client-side only and doesn't affect data access
✅ Cache keys don't include sensitive data
✅ Cache is cleared on page reload

## Backward Compatibility
✅ Fully backward compatible - no breaking changes
✅ Default behavior unchanged for all existing code
✅ Optional cache clearing function for advanced use cases
