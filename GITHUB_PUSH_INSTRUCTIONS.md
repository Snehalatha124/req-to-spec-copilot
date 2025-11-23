# How to Push to GitHub - Step by Step

## ✅ Step 1: Create Personal Access Token

1. **Go to GitHub Settings:**
   - Open: https://github.com/settings/tokens
   - Or: GitHub → Your Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token:**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Name: `req-to-spec-copilot`
   - Expiration: Choose 90 days or No expiration
   - **Select scopes:** Check ✅ `repo` (Full control of private repositories)
   - Click **"Generate token"** at the bottom

3. **Copy the Token:**
   - ⚠️ **IMPORTANT:** Copy the token NOW - you won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## ✅ Step 2: Push to GitHub

Run this command in your terminal:

```cmd
git push -u origin main
```

When prompted:
- **Username:** Enter `Snehalatha124`
- **Password:** Paste your **Personal Access Token** (NOT your GitHub password!)

## ✅ Step 3: Verify

After successful push, check your GitHub:
- Go to: https://github.com/Snehalatha124/req-to-spec-copilot
- You should see all your files!

---

## 🎉 Done!

Your project is now on GitHub!

