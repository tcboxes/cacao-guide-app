# GitHub Guide for Join Cacao's Guide

This document is a quick reference for saving your code to GitHub.

## ⚠️ Important: API Keys
**NEVER** commit your `.env` file containing your `API_KEY` to GitHub.
*   Ensure `.env` is listed in your `.gitignore` file.
*   If you deploy to a service like Vercel or Netlify, you will add the `API_KEY` in their "Environment Variables" settings dashboard, not in your code.

---

## 🚀 Scenario A: First Time Setup (New Repository)

If you haven't connected this code to GitHub yet:

1.  **Create a Repository:**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it (e.g., `join-cacao-guide`).
    *   Make it **Public** or **Private**.
    *   **Do not** check "Initialize with README" (you already have files).
    *   Click **Create repository**.

2.  **Connect & Push (in your terminal):**
    ```bash
    # 1. Initialize Git (if not already done)
    git init

    # 2. Add all your files to the staging area
    git add .

    # 3. Commit the files (save them locally)
    git commit -m "Initial commit: App structure and ceremony flow"

    # 4. Rename the branch to 'main'
    git branch -M main

    # 5. Connect to your GitHub repo (Replace YOUR_USERNAME with your actual username)
    git remote add origin https://github.com/YOUR_USERNAME/join-cacao-guide.git

    # 6. Push the code to GitHub
    git push -u origin main
    ```

---

## 🔄 Scenario B: Routine Updates (Saving Changes)

Use these commands whenever you have made changes (like changing text, icons, or logic) and want to save them.

```bash
# 1. Check which files have changed (optional, but good practice)
git status

# 2. Add all changes to the staging area
git add .

# 3. Commit the changes with a descriptive message
git commit -m "Updated ceremony flow to Pause-Open-Discover and added triangle logo"

# 4. Push the changes to GitHub
git push
```

---

## 🆘 Troubleshooting

*   **"Remote origin already exists":**
    *   This means you are already connected to a repo. You can check which one with `git remote -v`.
*   **"Updates were rejected because the remote contains work that you do not have":**
    *   Someone else (or you on another computer) pushed changes. You need to pull them first:
    *   `git pull origin main`
