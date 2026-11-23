# GitHub Pages deployment

Publish from this independent prototype folder. The workflow uploads only `site/`.

With GitHub CLI authenticated, run the following from the prototype root. Inspect any existing repository before reuse. Continue only after confirming it belongs to the verified account and is dedicated to this prototype.

```powershell
gh auth status
$owner = gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or -not $owner) { throw "GitHub authentication failed." }
$repo = "$owner/malnad-staff-portal-demo"
gh repo view $repo --json nameWithOwner,isPrivate,url,defaultBranchRef
```

If the repository does not exist and GitHub returned HTTP 404, run `gh repo create $repo --public`. If Git is uninitialised, run `git init -b main`, explicitly add `.github`, `site`, `tests` and the four Markdown files, then commit. Verify `git rev-parse --show-toplevel` and `git ls-tree -r --name-only HEAD`. Set the destination and push.

```powershell
git remote add origin "https://github.com/$repo.git"
git push -u origin main
```

In **Settings → Pages → Source**, select **GitHub Actions**. Start the workflow and verify the completed run.

```powershell
gh workflow run pages.yml --repo $repo
gh run list --workflow pages.yml --repo $repo --limit 5
gh api "repos/$repo/pages" --jq .html_url
```

Open the returned URL, test both demo roles and inspect static asset requests. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
