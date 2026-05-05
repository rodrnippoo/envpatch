# envpatch

Safely merge and diff `.env` files across environments with conflict resolution.

---

## Installation

```bash
npm install -g envpatch
```

---

## Usage

Diff two `.env` files to see what's changed:

```bash
envpatch diff .env.local .env.production
```

Merge changes from one environment into another with conflict resolution:

```bash
envpatch merge .env.staging .env.production --output .env.merged
```

When conflicts are detected, `envpatch` will prompt you to choose which value to keep, or you can pass `--strategy ours|theirs` to resolve automatically:

```bash
envpatch merge .env.staging .env.production --strategy ours
```

### Example Output

```
+ API_URL=https://api.production.example.com
~ DB_HOST: "localhost" → "db.production.example.com"
! CONFLICT: SECRET_KEY differs between files
- LEGACY_FLAG (removed in source)
```

---

## Why envpatch?

Managing `.env` files across multiple environments is error-prone. `envpatch` gives you a clear, auditable way to track differences and safely promote configuration changes without accidentally overwriting critical values.

---

## License

[MIT](LICENSE)