# FocusReader Pro <!-- omit in toc -->

Transform lengthy web pages into ADHD-friendly reading experiences directly in the browser.

## ✨ Features

- **Bionic Reading** — automatically bolds the first 40% of each word to guide the eye.
- **Alternating Sentence Highlights** — cycles subtle background colours every three sentences to maintain focus.
- **BeeLine-style Colour Cycling** — optional text tint that shifts hue line-by-line.
- **Reading Ruler** — a horizontal overlay that tracks your cursor to keep your place.
- **Focus Mode** — dims non-text media (images, video, iframes) so paragraphs pop.
- **Extra Spacing** — adds breathing room between sentences when desired.
- **One-click Toggle** — browser-action badge shows ON/OFF and persists across tabs/reloads.
- **Fine-grained Controls** — enable or disable each aid independently via the floating panel.


## 📸 Screenshots

![Screenshot.](https://github.com/xerocorps/adhd-focus-ext/blob/main/demo.png)

## 🚀 Quick Start

### 1. Clone \& install

```bash
git clone https://github.com/your-username/focusreader-pro.git
cd focusreader-pro
npm install          # only needed if you plan to run the dev server
```


### 2. Load in Chrome

1. Open `chrome://extensions/`
2. Enable “Developer mode”
3. Click “Load unpacked” and select the project folder
4. The green **F** icon appears; click to toggle focus aids.

### 3. Hack away (optional Dev Server)

```bash
npm run dev   # launches Vite + live-reload at localhost:5173
```

Any change to `content_script.js`, `style.css`, or HTML files auto-injects into the test page in `/demo`. Build artifacts are written to `/dist/` for production bundling.

## 🗂️ Repository Structure

```
focusreader-pro/
├─ extension/
│  ├─ content_script.js   # core transformations
│  ├─ service_worker.js   # badge logic + tab messaging
│  ├─ manifest.json       # MV3 configuration
│  ├─ style.css           # tokens + utility classes
│  ├─ index.html
│  └─ icon.png            # 16/48/128 px PNGs
│  └─ app.js              # Vue/React/Vanilla controls (optional)
└─ README.md
```


## ⚙️ Configuration Flags

| Setting | Default | Description |
| :-- | :--: | :-- |
| `global` | ✅ | Master switch for all aids |
| `bionic` | ✅ | Bold word prefixes |
| `highlight` | ✅ | Alternate background colours |
| `beeline` | ❌ | Line-wise colour hue |
| `ruler` | ❌ | Cursor-tracked overlay |
| `spacing` | ❌ | Extra sentence spacing |
| `focus` | ❌ | Media dimming |

Flags are stored with `chrome.storage.local`, so your preferences persist across sessions.

## 🛠️ Contributing

Found a bug or have an idea? PRs and issues are welcome!

1. Fork the repo \& create a branch:
`git checkout -b feature/amazing-idea`
2. Commit your changes with clear messages.
3. Open a pull request describing **why** the change is valuable.

Please follow the existing code style (Prettier + ESLint config included).

## 📄 License

MIT — see [`LICENSE`](LICENSE) for details.

> FocusReader Pro is not affiliated with BeeLine Reader® or the original Bionic Reading™ project. All trademarks belong to their respective owners.

<div style="text-align: center">⁂</div>

