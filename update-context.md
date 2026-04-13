# Updating m0x-context from upstream (Context7)

This repo tracks **[upstash/context7](https://github.com/upstash/context7)** as **`upstream`**. Your GitHub fork is **`origin`** (e.g. `https://github.com/xlyres-00/m0x-context.git`).

## One-time: check remotes

```bash
git remote -v
```

You should see:

- **`origin`** → your fork (`xlyres-00/m0x-context` or similar)
- **`upstream`** → `https://github.com/upstash/context7.git`

If `upstream` is missing:

```bash
git remote add upstream https://github.com/upstash/context7.git
```

## Update steps (each time)

1. **Fetch and merge** the official default branch (upstream uses **`master`**, not `main`):

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/master
   ```

2. **If Git reports conflicts**, open the listed files, fix the `<<<<<<<` / `=======` / `>>>>>>>` sections, then:

   ```bash
   git add -A
   git commit -m "Merge upstream/master"
   ```

3. **Install and build**:

   ```bash
   pnpm install
   pnpm build
   ```

4. **Push your fork**:

   ```bash
   git push origin main
   ```

5. **Redeploy** your server (rebuild the Docker image or run `docker compose up --build` — see **HOSTING.md**).

## Notes

- **Docs inside the app** still come from the Context7 API at runtime; this process updates **your server code** only.
- If **`git merge`** complains about `upstream/main`, use **`upstream/master`** (upstream’s default branch).
- On Windows, if Git says **“dubious ownership”** for this folder:

  ```bash
  git config --global --add safe.directory D:/code/ai/m0x-context7
  ```

  (Adjust path if your clone lives elsewhere.)
