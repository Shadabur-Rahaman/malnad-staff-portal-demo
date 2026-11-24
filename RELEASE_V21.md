# v2.1 release verification — 24 November 2026

Status: local changes saved; live release blocked. Baseline HEAD and cached origin/main: ff53f88cd1e3da0e71ecc30b674ba893e4ecd98c. The existing Pages workflow uploads site/ and its root index.html. No Django files were accessed or modified.

Observed in Chrome: the first existing live tab displayed the older demo. A fresh cache-busted navigation displayed v2.0. Principal, Admin and Staff quick login and sign-out worked on v2.0; principal dashboard showed 15 staff and ₹378,250 net, Admin menu showed only Overview and Employees, MAL001 displayed ₹32,500 net. The Staff overview lacked its salary-history results, consistent with the original render function not initializing filters on the dashboard route. Local v2.1 fixes this.

Changes include session restoration without password storage, login feedback and visibility toggle, profile details, optional fictional email, employee field validation, crop zoom and confirmation, draft salary preview, publication/payment model operations, filtered charts and report scope in PDF headers. The original PDF writer is retained because npm registry DNS failed when checking pdf-lib; searchable text remains unavailable. PDF contents and download have not been verified in a browser.

Local browser attempt: Chrome navigation to http://127.0.0.1:8765/ returned ERR_CONNECTION_TIMED_OUT. Local end-to-end, photo lifecycle, CRUD, PDF downloads, seven responsive viewport checks and keyboard/touch validation remain unverified. Do not treat the v2.0 browser observation as a v2.1 test.

GitHub CLI: github.com and api.github.com DNS failed; remote SHA and Actions run cannot be confirmed from the shell. The GitHub integration is not installed. The public live page was reachable in Chrome, but it serves v2.0, not v2.1. Git metadata is read-only in this managed workspace. No new repository was created.

Publish using Windows PowerShell from the exact existing repository, after performing local browser QA (see DEPLOYMENT.md). Do not publish until the release-blocking tests are complete. Review the diff and explicit public-file list, commit, push origin main, check the Pages workflow, then reload the live URL with a fresh version query and test all three roles.
