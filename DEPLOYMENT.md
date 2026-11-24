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

The existing verified local remote is `https://github.com/shadabur-rahaman/malnad-staff-portal-demo.git`. Do not create another repository. Confirm the authenticated identity and ownership before publishing. Review the diff and run the tests before committing.

```powershell
npm test
git diff --check
git status --short
git add site tests README.md DEMO_LIMITATIONS.md SECURITY_CHECKLIST.md DEPLOYMENT.md
git commit -m "Upgrade staff portal to v2.0 demo"
git push origin main
```

In **Settings → Pages → Source**, select **GitHub Actions**. Start the workflow and verify the completed run.

```powershell
gh workflow run pages.yml --repo $repo
gh run list --workflow pages.yml --repo $repo --limit 5
gh api "repos/$repo/pages" --jq .html_url
```

Open the returned URL, test all three demo roles, download and inspect PDFs, check photo and payroll workflows, and verify layouts at 320, 360, 375, 390, 430, 768, 1024 and 1440 px. Do not mark deployment successful until the new version is visible. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
