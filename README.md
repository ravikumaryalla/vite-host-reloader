# vite-host-reloader

🔄 **Reload the host application automatically when any micro-frontend remote changes during development.**

`vite-host-reloader` is a Vite plugin built for **micro-frontend architectures** where multiple Vite dev servers (host + remotes) run in parallel.

When a remote (submodule) changes, the plugin notifies the host via **WebSockets**, triggering a **full reload of the host app** — no more manual browser refreshes.

---

## Why this plugin exists

In most micro-frontend setups:

- The **host** runs on one Vite dev server
- Each **remote/module** runs on its own Vite dev server
- Updating a remote does **not** automatically reload the host

This results in:

- constant manual refreshes
- broken development flow
- confusion when changes don’t reflect immediately

`vite-host-reloader` solves this by creating a lightweight **WebSocket bridge** between remotes and the host.

---

## Features

- Reloads host when any remote changes
- Supports multiple remotes
- Works with Vite + Module Federation
- Compatible with Vite 4, 5, 6, 7
- Fully ESM-safe
- pnpm-safe (no symlink hacks)
- Dev-only (zero production impact)

---

## Installation

```bash
npm install vite-host-reloader --save-dev
# or
pnpm add vite-host-reloader -D
# or
yarn add vite-host-reloader -D
```
