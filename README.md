# Malnad Staff Portal · Public Demo

Interactive GitHub Pages prototype for Malnad Skill Development Centre. Choose **View as Principal** to explore staff management, draft payroll and reports. Choose **View as Employee** to inspect published salary history and print a sample payslip. All employee data is fictional.

## Local preview

From the prototype root, run `python -m http.server 8000 --directory site` and open <http://localhost:8000/>. Python is only an optional static file server for local review. The published site uses HTML, CSS, Bootstrap 5 and vanilla JavaScript.

Run `node --test tests/demo.test.mjs` using Node.js 22 or later. See [deployment](DEPLOYMENT.md), [limitations](DEMO_LIMITATIONS.md) and [publication audit](SECURITY_CHECKLIST.md).
