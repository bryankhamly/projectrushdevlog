# ProjectRush Showcase

This folder is a standalone static website for showing ProjectRush screenshots,
the prototype gameplay link, character creation, 1-8 player co-op, and authoring workspaces.

## Open locally

Open `index.html` in a browser. No build step is required.

If you prefer a local server:

```powershell
python -m http.server 5173 --directory devlog
```

Then open `http://localhost:5173`.

## Edit content

- `index.html` owns the page structure and copy.
- `styles.css` owns the layout, colors, responsive behavior, and visual placeholders.
- `script.js` owns the screenshot preview modal and sticky header state.
- `media/` contains the screenshots used by the galleries.

When adding a screenshot, place it in `media/`, then add a matching `.image-card`
inside the right category in `index.html`.
