# Malnad Staff Portal · Public Demo

Interactive GitHub Pages prototype v2.0 for Malnad Skill Development Centre. Choose **Try as Principal**, **Try as Admin**, or **Try as Staff** to explore the simulated role-specific workflows. All employee data is fictional. Public demo credentials are displayed on the login screen; staff accounts MAL001–MAL015 share the displayed staff demo password. Changes are local to the browser, and the principal can reset the demo from Settings.

## Local preview

From the prototype root, run `python -m http.server 8000 --directory site` and open <http://localhost:8000/>. Python is only an optional static file server for local review. The published site uses HTML, CSS, Bootstrap 5 and vanilla JavaScript.

Run `node --test tests/demo.test.mjs` using Node.js 22 or later. See [deployment](DEPLOYMENT.md), [limitations](DEMO_LIMITATIONS.md) and [publication audit](SECURITY_CHECKLIST.md).
