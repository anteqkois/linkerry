# Start

1. [Install pnpm package manager](https://pnpm.io/installation)
2. Install globally cx

```sh
pnpm add -g commitizen
```

# Usefull commends
### pnpm
Install package for app
```sh
pnpm add <package> --filter <workspace>
```

Uninstall package for app
```sh
pnpm uninstall <package> --filter <workspace>
```

Upgrade a package in a workspace
```sh
pnpm update <package> --filter <workspace>
```

Use internal package - it's simple, add in package json, for example:
```json
 "tsconfig": "workspace:*"
```
### Manage repo
Create commit
```