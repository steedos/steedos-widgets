# GitHub Copilot Instructions for Steedos Widgets

This file provides context and guidelines for GitHub Copilot when working with this project.

## Project Overview

Steedos Widgets is a monorepo containing reusable UI widgets and components for the Steedos platform. The project uses Lerna for package management and Rollup for bundling.

## Architecture

- **Monorepo Structure**: Managed by Lerna with Yarn workspaces
- **Build System**: Rollup for building UMD modules
- **Type System**: TypeScript with shared tsconfig
- **Styling**: Tailwind CSS, PostCSS
- **Development Server**: Custom dev server with hot reload

## Key Directories

- `packages/@steedos-widgets/`: Individual widget packages
  - `amis-object/`: Main AMIS-based object widgets
  - `amis-lib/`: Shared AMIS library code
  - `reactflow/`: React Flow integration
  - `liveblocks/`: Liveblocks collaboration features
  - Other widget-specific packages
- `apps/`: Example applications
  - `storybook/`: Storybook for component development
  - `experience/`: Experience application
  - `builder6/`: Builder application

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over type aliases for object shapes
- Use explicit return types for public APIs
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Follow React best practices for performance (memo, useMemo, useCallback)
- Props should have TypeScript interfaces defined

### Styling

- Use Tailwind CSS utility classes when possible
- Follow BEM naming for custom CSS classes
- Keep styles close to components

### File Organization

```
package/
  src/
    components/     # React components
    hooks/          # Custom hooks
    utils/          # Utility functions
    types/          # TypeScript type definitions
    styles/         # CSS/SCSS files
    index.ts        # Public API exports
  dist/             # Build output (gitignored)
  package.json
  tsconfig.json
  rollup.config.ts
```

## Common Patterns

### Creating a New Widget Package

1. Create new directory in `packages/@steedos-widgets/`
2. Copy `package.json` and `rollup.config.ts` from similar package
3. Update package name and dependencies
4. Add to root `tsconfig.json` paths
5. Implement in `src/` directory
6. Export public API from `src/index.ts`

### Adding Dependencies

- Peer dependencies: React, ReactDOM (don't bundle)
- Internal dependencies: Other @steedos-widgets packages
- External dependencies: Bundle only necessary dependencies

### Build Configuration

- Rollup outputs: CJS, ESM, and UMD formats
- External globals for common libraries (React, lodash, etc.)
- PostCSS for CSS processing
- Source maps for debugging

## Development Workflow

```bash
# Start development server (recommended)
yarn dev

# Build all packages
yarn build

# Build specific package
lerna run build --scope=@steedos-widgets/amis-object

# Watch mode for specific package
cd packages/@steedos-widgets/amis-object
yarn watch
```

## Testing

- Write unit tests in `__tests__` directories
- Use Jest for testing framework
- Test files should be named `*.test.ts` or `*.test.tsx`
- Aim for meaningful tests, not just coverage

## Documentation

- Document all public APIs with JSDoc comments
- Include usage examples in README files
- Update CHANGELOG.md for notable changes

## Code Quality

- Run `yarn lint` before committing
- All code should pass ESLint and Prettier checks
- Use descriptive variable and function names
- Add comments for complex logic

## Integration with Steedos Platform

- Widgets are loaded as UMD bundles via unpkg
- Configuration via `STEEDOS_PUBLIC_PAGE_ASSETURLS` environment variable
- Assets manifest in `dist/assets-dev.json`

## AI Assistant Tips

When using GitHub Copilot or other AI assistants:

1. **Be Specific**: Provide context about which package you're working in
2. **Follow Patterns**: Look at existing code for patterns to follow
3. **Type Safety**: Always provide TypeScript types
4. **Documentation**: Add JSDoc comments for better suggestions
5. **Incremental**: Make small, focused changes
6. **Test**: Consider test cases when writing new features

## Common Tasks for AI

### "Create a new React component"
- Use functional component with TypeScript
- Define Props interface
- Export from index.ts
- Add basic documentation

### "Add a new feature to existing component"
- Check existing patterns in the package
- Maintain backward compatibility
- Update TypeScript types
- Add tests if applicable

### "Fix a bug"
- Understand the context from surrounding code
- Preserve existing behavior
- Add regression test if possible

### "Optimize performance"
- Use React.memo for expensive components
- Implement useMemo/useCallback where appropriate
- Check bundle size impact

## Version Control

- Use conventional commits (enforced by commitlint)
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

## Dependencies to Watch

- React version compatibility
- Rollup plugins versions
- TypeScript version
- AMIS library updates

## Questions?

Refer to:
- DEVELOPMENT.md - Detailed development guide
- QUICKSTART.md - Quick start guide
- README.md - Project overview
- Individual package READMEs for specific documentation
