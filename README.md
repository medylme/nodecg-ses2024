# WAH 2023 - NodeCG Graphics

NodeCG Graphics for the [WAH 2023 osu! tourney](https://osu.ppy.sh/community/forums/topics/1808443?n=1).

## Package Commands

- `autofix`: Automatically fix any possible linting errors using ESLint.
- `autofix:browser`: See above, but only for browser based code.
- `autofix:extension`: See above, but only for extension based code/typings.
- `build`: Build written code for use in production.
- `build:browser`: See above, but only for browser based code.
- `build:extension`: See above, but only for extension based code.
- `clean`: Clean up all built/watched files.
- `lint`: Finds any possible linting errors using ESLint, but does not fix them.
- `lint:browser`: See above, but only for browser based code.
- `lint:extension`: See above, but only for extension based code/typings.
- `prebuild`: Alias for `clean`, will automatically run before `build` if called.
- `schema-types`: Create TypeScript typings for schemas/`Configschema.json` using `nodecg-cli`.
- `start`: Start NodeCG.
- `watch`: Build code and watch for changes, for use in development.
- `watch:browser`: See above, but only for browser based code.
- `watch:extension`: See above, but only for extension based code.

## Technical Details

For more technical details, refer to the [nodecg-vue-ts-template](https://github.com/zoton2/nodecg-vue-ts-template) repository, as this is built off of that.
