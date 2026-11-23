import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { employees, filterEmployees, periods, salaryCsv, totals } from "../site/assets/data.js";

test("fictional roster has the expected categories and unique IDs", () => {
  assert.equal(employees.length,15);
  assert.equal(new Set(employees.map(row=>row.id)).size,15);
  assert.equal(filterEmployees(employees,{category:"Teaching"}).length,10);
  assert.equal(filterEmployees(employees,{category:"Non-teaching"}).length,5);
});

test("both periods preserve their publication states and payroll figures", () => {
  assert.equal(periods.october.status,"Published");
  assert.equal(periods.november.status,"Draft");
  assert.deepEqual(totals(employees),{gross:382000,deductions:3750,net:378250,paid:0,unpaid:15});
  const [row]=employees;
  assert.deepEqual([row.id,row.basic,row.allowances,row.bonus,row.gross,row.deductions,row.net],
    ["MAL001",30000,2000,1000,33000,500,32500]);
});

test("employee filters combine correctly", () => {
  assert.equal(filterEmployees(employees,{search:" ayESHA ",department:"Data Science",category:"Teaching",payment:"Unpaid"})[0].id,"MAL001");
  assert.equal(filterEmployees(employees,{search:"MAL001",category:"Non-teaching"}).length,0);
});

test("CSV contains filtered totals and escapes formula-like text", () => {
  const csv=salaryCsv(periods.october,[{...employees[0],name:" =1+2"}]);
  assert.match(csv,/"' =1\+2"/);
  assert.match(csv,/"Total","","","33000\.00","500\.00","32500\.00"/);
  assert.doesNotMatch(csv,/MAL002/);
});

test("publication tree matches the static allowlist and contains no credentials", () => {
  const root=new URL("../site/",import.meta.url);
  assert.deepEqual(readdirSync(root).sort(),["assets","index.html"]);
  const assets=new URL("assets/",root);
  assert.deepEqual(readdirSync(assets).sort(),["app.js","bootstrap-license.txt","bootstrap.min.css","data.js","portal.css"]);
  for (const name of ["index.html","assets/app.js","assets/data.js","assets/portal.css"]) {
    const text=readFileSync(new URL(name,root),"utf8");
    assert.doesNotMatch(text,/django-insecure-|BEGIN [A-Z ]*PRIVATE KEY|gh[pousr]_[a-z0-9]{20,}|github_pat_|pbkdf2_sha256\$|@malnad\.example|\.sqlite3\b|\bfetch\s*\(|\bXMLHttpRequest\b|\b(localStorage|sessionStorage|indexedDB)\b/i);
    assert.doesNotMatch(text,/(src|href)=["']https?:\/\//i);
  }
  const page=readFileSync(new URL("index.html",root),"utf8");
  for(const [,asset] of page.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert.ok(readFileSync(new URL(asset,root)).length);
});
