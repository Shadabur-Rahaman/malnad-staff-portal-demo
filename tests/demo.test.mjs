import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { employees, filterEmployees, periods, salaryCsv, totals } from "../site/assets/data.js";
import {seed,login,calculate,records,saveStaff,summary,publishPeriod,togglePayment,cropRect} from '../site/assets/model.js';

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
  assert.deepEqual(readdirSync(assets).sort(),["app.js","bootstrap-license.txt","bootstrap.min.css","data.js","model.js","pdf.js","portal.css","v2.js"]);
  for (const name of ["index.html","assets/app.js","assets/data.js","assets/portal.css","assets/model.js","assets/pdf.js","assets/v2.js"]) {
    const text=readFileSync(new URL(name,root),"utf8");
    assert.doesNotMatch(text,/django-insecure-|BEGIN [A-Z ]*PRIVATE KEY|gh[pousr]_[a-z0-9]{20,}|github_pat_|pbkdf2_sha256\$|@malnad\.example|\.sqlite3\b|\bfetch\s*\(|\bXMLHttpRequest\b/i);
    assert.doesNotMatch(text,/(src|href)=["']https?:\/\//i);
  }
  const page=readFileSync(new URL("index.html",root),"utf8");
  for(const [,asset] of page.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) assert.ok(readFileSync(new URL(asset,root)).length);
});
test('all roles and fifteen public staff credentials',()=>{const db=seed();assert.equal(login(db,'principal.demo','MalnadDemo@2026').role,'Principal');assert.equal(login(db,'admin.demo','AdminDemo@2026').role,'Admin');for(const s of db.staff)assert.equal(login(db,s.id.toLowerCase()+'.demo','StaffDemo@2026').id,s.id);assert.equal(login(db,'principal.demo','wrong'),null);assert.equal(db.staff.some(s=>s.name==='Firoz Khan'),false)});
test('mutable records, precise salary calculations and date ranges',()=>{const db=seed();assert.equal(records(db,{status:'Published'}).length,15);assert.equal(records(db,{from:'2026-10',to:'2026-11'}).length,30);assert.equal(summary(records(db,{status:'Published'})).net,378250);assert.throws(()=>records(db,{from:'2026-12',to:'2026-10'}));const r=calculate({...db.periods['2026-11'].rows[0],bonus:1000.01});assert.equal(r.net,32500.01);assert.throws(()=>calculate({...r,deductions:999999}));assert.equal(summary([r]).net,32500.01)});
test('staff lifecycle preserves historical salary records and reset',()=>{const db=seed();const s={...db.staff[0],id:'MAL016',name:'Fictional New Staff'};saveStaff(db,s);assert.equal(db.staff.length,16);assert.throws(()=>saveStaff(db,s));saveStaff(db,{...s,status:'Archived'},s.id);assert.equal(login(db,'mal016.demo','StaffDemo@2026'),null);assert.equal(records(db,{id:'MAL001'}).length,2);assert.equal(seed().staff.length,15)});
test('employee optional email, invalid categories and protected identity',()=>{const db=seed();const s={...db.staff[0],id:'MAL016',email:''};saveStaff(db,s);assert.equal(db.staff.length,16);assert.throws(()=>saveStaff(db,{...s,category:'Principal'},s.id));assert.throws(()=>saveStaff(db,{...s,id:'principal.demo'}));assert.throws(()=>saveStaff(db,{...s,id:'MAL017'},'MAL999'));});
test('publish and payment operations update published filters and reset',()=>{const db=seed();assert.throws(()=>togglePayment(db,'2026-11','MAL001'));db.periods['2026-11'].rows[0]=calculate({...db.periods['2026-11'].rows[0],bonus:1200});publishPeriod(db,'2026-11');assert.equal(records(db,{status:'Published',id:'MAL001'}).at(-1).net,32700);assert.equal(togglePayment(db,'2026-11','MAL001'),'Paid');assert.equal(summary(db.periods['2026-11'].rows).paid,1);assert.equal(togglePayment(db,'2026-11','MAL001'),'Unpaid');assert.throws(()=>publishPeriod(db,'2026-11'));assert.equal(seed().periods['2026-11'].status,'Draft');});
test('crop geometry is square, bounded and supports zoom',()=>{assert.deepEqual(cropRect(400,200),[100,0,200,200]);assert.deepEqual(cropRect(400,200,2,100,100),[300,100,100,100]);assert.throws(()=>cropRect(10,200));assert.throws(()=>cropRect(400,200,4));});
test('report filters combine month, publication, employee and department',()=>{const db=seed();assert.equal(records(db,{from:'2026-10',to:'2026-10',department:'Data Analytics'}).length,2);assert.equal(records(db,{from:'2026-10',to:'2026-11',id:'MAL001',status:'Published'}).length,1);assert.equal(records(db,{from:'2027-01',to:'2027-12'}).length,0);});
