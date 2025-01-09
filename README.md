# TodoList Desktop App

A feature-rich desktop todo application built with Electron and Vue.js.

## Features

- ✨ Modern and intuitive user interface
- 📝 Rich text editor for task details
- 🔄 Automatic data backup and restore
- ⚡ Global keyboard shortcuts (Cmd/Ctrl+F for search)
- 🔌 System tray integration
- 🚀 Auto-launch on system startup
- 💫 Smooth animations and transitions
- 🎨 Customizable quit behavior (close or minimize to tray)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/Dingbai/todoList.git
cd todolist
```

2. Install dependencies (requires pnpm):

```sh
pnpm install
```

## Development

Run the app in development mode with hot reload:

```sh
pnpm run electron:dev
```

## Building

Create production build for your platform:

```sh
# Build for Windows
pnpm run build:win

# Build for macOS
pnpm run build:mac
```
