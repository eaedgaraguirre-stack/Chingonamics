# Caminos y Presidios

Single-page pilot site for **Caminos y Presidios**, a historical atlas concept focused on the northern Mexican presidio system (1822–1846).

## Stack

- Plain HTML (`index.html`)
- Plain CSS (`styles.css`)
- Vanilla JS (`script.js`)
- No framework, no build step

## Local preview

Open `index.html` directly in a browser, or run a simple local server:

```bash
cd /home/runner/work/Chingonamics/Chingonamics
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## GitHub Pages deploy (Project Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default branch)
   - **Folder:** `/ (root)`
4. Save and wait for deployment.
5. Your site will publish at:
   - `https://<username>.github.io/<repository>/`

## GitHub Pages deploy (User/Org Pages)

If this repository is named `<username>.github.io`, set Pages to deploy from `main` root and the site publishes at `https://<username>.github.io/`.

## Content notes

- `script.js` includes a clearly marked TODO to replace the sample 12-presidio array with the full 44-post dataset.
- `index.html` includes TODO comments for production URL, final atlas SVG geometry, documentary trailer embed, and tours form backend wiring.
