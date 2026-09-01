# tools/

## screenshot.mjs

Renders every prototype screen at 1440×900 and 375×824 and reports console
errors — the sanity check used before pushing.

Playwright is deliberately **not** a dependency of this project: Vercel installs
devDependencies during the build, and Playwright's postinstall would try to
download browsers there. Install it only when you want to run this check:

```bash
npm i --no-save playwright
npm run build && npx vite preview --port 4174 &
BASE=http://localhost:4174 OUT=/tmp/shots node tools/screenshot.mjs dashboard spl profile
```

Pass screen ids (the hash routes) as arguments; omit none — there is no default
list. On this container Chromium is preinstalled, which is why the script points
`executablePath` at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Drop
that option to use a locally installed Playwright browser instead.
