import { employees, filterEmployees, money, periods, salaryCsv, totals } from "./data.js";

const content = document.querySelector("#content");
const navigation = document.querySelector("#navigation");
const layout = document.querySelector("#layout");
const departments = [...new Set(employees.map(row => row.department))].sort();
const state = { period: "october", employee: employees[0] };
const amount = value => money.format(value);
const badge = label => `<span class="status ${label === "Published" ? "published" : ""}">${label}</span>`;
const metrics = items => `<dl class="grid">${items.map(([label,value,feature]) =>
  `<div class="metric ${feature ? "feature" : ""}"><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>`;
const payMetrics = sum => [["Gross salary",amount(sum.gross)],["Deductions",amount(sum.deductions)],["Net salary",amount(sum.net),true]];
const all = totals(employees);

function welcome() {
  return `<section class="hero"><p class="eyebrow">Malnad Skill Development Centre</p><h1>Malnad Staff Portal</h1>
  <p class="fs-5">Explore the staff directory, review monthly payroll and see the salary statement employees receive.</p>
  <div class="actions"><a class="btn btn-teal" href="#principal">View as Principal</a><a class="btn btn-outline-light" href="#employee">View as Employee</a></div></section>
  <div class="grid"><section class="panel"><h2>Staff directory</h2><p>Find teaching and non-teaching staff by name, ID or department.</p></section>
  <section class="panel"><h2>Payroll review</h2><p>Compare published and draft months and inspect earnings and deductions.</p></section>
  <section class="panel"><h2>Salary statements</h2><p>Select a fictional employee to view published salary history and a printable payslip.</p></section></div>`;
}

function principal() {
  return `<p class="eyebrow">Principal demo</p><h1>Welcome, Firoz Khan</h1>
  ${metrics([["Employees",employees.length],["Teaching staff",employees.filter(e=>e.category==="Teaching").length],
    ["Non-teaching staff",employees.filter(e=>e.category==="Non-teaching").length]])}
  <section class="panel"><div class="heading"><h2>October 2026 payroll</h2>${badge("Published")}</div>
  ${metrics(payMetrics(all))}<p>${all.paid} paid · ${all.unpaid} not marked paid</p>
  <div class="actions"><a class="btn btn-teal" href="#payroll">Review payroll</a><a class="btn btn-outline-secondary" href="#reports">Open reports</a></div></section>
  <section class="panel"><h2>Staff directory</h2><p>Browse all 15 fictional employee profiles.</p><a class="btn btn-outline-secondary" href="#directory">Open staff directory</a></section>`;
}

function optionList(values, placeholder) {
  return `<option value="">${placeholder}</option>` + values.map(value => `<option>${value}</option>`).join("");
}

function filters(withPayment = false) {
  return `<div class="grid" id="filters">
  <label>Search by employee name or ID<input class="form-control" type="search" id="search" placeholder="e.g. MAL001"></label>
  <label>Department<select class="form-select" id="department">${optionList(departments,"All departments")}</select></label>
  <label>Category<select class="form-select" id="category">${optionList(["Teaching","Non-teaching"],"All categories")}</select></label>
  ${withPayment ? `<label>Payment status<select class="form-select" id="payment">${optionList(["Paid","Unpaid"],"All statuses")}</select></label>` : ""}
  </div>`;
}

function table(headers, rows, label) {
  return `<div class="scroll-table" role="region" aria-label="${label}" tabindex="0"><table class="table">
  <thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join("")}</tr></thead>
  <tbody>${rows.length ? rows.map(row=>`<tr><th scope="row">${row[0]}</th>${row.slice(1).map(cell=>`<td>${cell}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${headers.length}">No employees match these filters.</td></tr>`}</tbody></table></div>`;
}

function selectedRows() {
  const fields = [...document.querySelectorAll("#filters input, #filters select")];
  return filterEmployees(employees,Object.fromEntries(fields.map(field=>[field.id,field.value])));
}

function directory() {
  return `<h1>Staff directory</h1><section class="panel">${filters()}<p id="record-count" aria-live="polite"></p><div id="results"></div></section>`;
}

function payrollControls(report = false) {
  return `<section class="panel"><div class="heading"><h2 id="period-heading"></h2>
  <label>Payroll period<select class="form-select" data-period>${Object.entries(periods).map(([key,p])=>
    `<option value="${key}" ${key===state.period ? "selected" : ""}>${p.name} · ${p.status}</option>`).join("")}</select></label></div>
  <p id="period-notice"></p>${filters(true)}<div id="summary"></div><p id="record-count" aria-live="polite"></p>
  ${report ? '<button class="btn btn-teal mb-3" data-export>Download demo CSV</button>' : ""}<div id="results"></div></section>`;
}
const payroll = () => `<h1>Payroll management</h1>${payrollControls()}`;
function reports() {
  return `<h1>Reports &amp; analytics</h1><section class="panel"><h2>2026 annual payroll overview</h2>
  <p>Published payroll and provisional drafts are shown separately.</p><ul class="chart list-unstyled" aria-label="Monthly net payroll">
  ${Object.entries(periods).map(([key,p])=>`<li><div class="heading"><label for="trend-${key}">${p.name} ${badge(p.status)}</label>
  <strong>${amount(all.net)}</strong></div><meter id="trend-${key}" min="0" max="${Math.ceil(all.net*1.1)}" value="${all.net}"></meter></li>`).join("")}</ul>
  ${metrics([["Published net payroll",amount(all.net)],["Provisional draft net",amount(all.net)]])}</section>
  ${payrollControls(true)}<section class="panel"><h2>Department breakdown</h2><div id="department-table"></div></section>`;
}
function profile(row) {
  return `<dl class="profile"><dt>Employee ID</dt><dd>${row.id}</dd><dt>Employee name</dt><dd>${row.name}</dd>
  <dt>Department</dt><dd>${row.department}</dd><dt>Designation</dt><dd>${row.designation}</dd><dt>Category</dt><dd>${row.category}</dd></dl>`;
}

function employee() {
  const row=state.employee;
  return `<p class="eyebrow">Employee demo</p><div class="heading"><h1>Welcome, ${row.name}</h1>
  <label>Demo employee<select class="form-select" data-employee>${employees.map(r=>`<option value="${r.id}" ${r===row ? "selected" : ""}>${r.id} · ${r.name}</option>`).join("")}</select></label></div>
  <section class="panel"><h2>Employment profile</h2>${profile(row)}</section>
  <section class="panel"><div class="heading"><h2>October 2026 salary</h2>${badge("Published")}</div>
  ${metrics(payMetrics(row))}<p>Payment status · <strong>Not marked paid</strong></p><h2>Monthly salary history</h2>
  ${table(["Period","Gross","Deductions","Net","Payment","Payslip"],[["October 2026",amount(row.gross),amount(row.deductions),amount(row.net),
    "Not marked paid",'<a class="btn btn-outline-secondary" href="#payslip">View sample payslip</a>']],"Published salary history")}</section>`;
}

function breakdown(row) {
  const items=[["Basic salary",row.basic],["Allowances",row.allowances],["Bonus",row.bonus],["Other earnings",row.other],
    ["Gross salary",row.gross],["Deductions",row.deductions],["Net salary",row.net]];
  return `<table class="table"><thead><tr><th scope="col">Description</th><th scope="col">Amount (INR)</th></tr></thead>
  <tbody>${items.map(([label,value])=>`<tr><th scope="row">${label}</th><td>${amount(value)}</td></tr>`).join("")}</tbody></table>`;
}
function payslip() {
  const row=state.employee;
  return `<div class="actions mb-3 no-print"><a class="btn btn-outline-secondary" href="#employee">Back to salary history</a>
  <button class="btn btn-teal" data-print>Print or save as PDF</button></div><article class="panel statement">
  <div class="statement-head"><p>Malnad Skill Development Centre</p><h1>Monthly salary statement</h1><p class="mb-0">October 2026 · DEMO — Fictional Data</p></div>
  <section class="my-3" aria-label="Employee information">${profile(row)}</section>${breakdown(row)}
  <p><strong>Payment status</strong> · Not marked paid</p><p>Payment status reflects a sample administrative record.</p>
  <p class="small mb-0">Reference MAL-DEMO-2026-10-${row.id} · Public demonstration payslip</p></article>`;
}

const routes={welcome,principal,directory,payroll,reports,employee,payslip};
let current="welcome";
function render() {
  const requested=location.hash.slice(1);
  if(requested==="content") return;
  current=Object.hasOwn(routes,requested) ? requested : "welcome";
  const links=["employee","payslip"].includes(current) ? [["employee","My salary"],["payslip","Sample payslip"],["principal","View as Principal"]]
    : [["principal","Dashboard"],["directory","Staff directory"],["payroll","Payroll"],["reports","Reports &amp; analytics"],["employee","View as Employee"]];
  navigation.hidden=current==="welcome";
  layout.classList.toggle("with-nav",!navigation.hidden);
  navigation.innerHTML=links.map(([key,label])=>`<a href="#${key}" ${key===current ? 'aria-current="page"' : ""}>${label}</a>`).join("");
  content.innerHTML=routes[current]();
  renderResults();
}

function renderResults() {
  const results=document.querySelector("#results");
  if(!results) return;
  const rows=selectedRows();
  document.querySelector("#record-count").textContent=`${rows.length} of ${employees.length} employees`;
  if(current==="directory") {
    results.innerHTML=table(["ID","Name","Department","Designation","Category","Profile"],rows.map(row=>
      [row.id,row.name,row.department,row.designation,row.category,`<button class="btn btn-outline-secondary" data-profile="${row.id}">View profile</button>`]),"Staff directory");
    return;
  }
  const period=periods[state.period];
  const draft=period.status==="Draft";
  document.querySelector("#period-heading").innerHTML=`${period.name} ${badge(period.status)}`;
  document.querySelector("#period-notice").textContent=draft
    ? "Draft · Not yet published. Amounts are provisional. Draft preview changes are simulations."
    : "Published · Available in the employee demo. Payment status is an administrative indicator.";
  const sum=totals(rows);
  document.querySelector("#summary").innerHTML=metrics([...payMetrics(sum),["Paid",sum.paid],["Not marked paid",sum.unpaid]]);
  results.innerHTML=table(["ID","Name","Department","Gross","Deductions","Net","Payment","Breakdown"],rows.map(row=>
    [row.id,row.name,row.department,amount(row.gross),amount(row.deductions),amount(row.net),"Not marked paid",
    `<button class="btn btn-outline-secondary" data-salary="${row.id}">${current==="payroll"&&draft ? "Simulate draft" : "View breakdown"}</button>`]),"Employee payroll");
  const departmentTable=document.querySelector("#department-table");
  if(departmentTable) departmentTable.innerHTML=table(["Department","Employees","Gross","Deductions","Net"],departments.flatMap(name=>{
    const group=rows.filter(row=>row.department===name);
    const values=totals(group);
    return group.length ? [[name,group.length,amount(values.gross),amount(values.deductions),amount(values.net)]] : [];
  }),"Department payroll");
}

function showDetails(row,salary) {
  const draft=salary&&current==="payroll"&&state.period==="november";
  const dialog=document.createElement("dialog");
  dialog.className="panel";
  dialog.setAttribute("aria-labelledby","dialog-title");
  dialog.innerHTML=`<div class="heading"><h2 id="dialog-title">${row.name}</h2>
  <button class="btn btn-outline-secondary" data-close autofocus>Close</button></div>${profile(row)}${salary ? breakdown(row) : ""}
  ${draft ? `<section><h3>Draft preview · Simulation</h3><label>Simulated bonus (INR)
  <input class="form-control" type="number" min="0" max="1000000" step="0.01" value="${row.bonus}" id="preview-bonus"></label>
  <p class="mt-2" role="status" id="preview-result"></p></section>` : ""}`;
  dialog.addEventListener("close",()=>dialog.remove(),{once:true});
  dialog.querySelector("[data-close]").addEventListener("click",()=>dialog.close());
  document.body.append(dialog);
  dialog.showModal();
  if(!draft) return;
  const bonus=dialog.querySelector("#preview-bonus");
  const result=dialog.querySelector("#preview-result");
  const update=()=>{
    if(!bonus.value||!bonus.checkValidity()) {
      result.textContent="Enter a valid bonus between ₹0 and ₹10,00,000.";
      return;
    }
    const grossPaise=(row.gross-row.bonus)*100+Math.round(bonus.valueAsNumber*100);
    result.textContent=`Simulated gross ${amount(grossPaise/100)} · Simulated net ${amount((grossPaise-row.deductions*100)/100)}`;
  };
  bonus.addEventListener("input",update);
  update();
}
function downloadCsv() {
  const uri=URL.createObjectURL(new Blob([salaryCsv(periods[state.period],selectedRows())],{type:"text/csv;charset=utf-8"}));
  const link=document.createElement("a");
  link.href=uri;
  link.download=`malnad-demo-${state.period}-2026.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(uri),1000);
}

content.addEventListener("input",event=>{if(event.target.matches("#filters input")) renderResults();});
content.addEventListener("change",event=>{
  if(event.target.matches("[data-period]")) state.period=event.target.value;
  if(event.target.matches("[data-employee]")) {
    state.employee=employees.find(row=>row.id===event.target.value);
    render();
    document.querySelector("[data-employee]").focus();
    return;
  }
  renderResults();
});
content.addEventListener("click",event=>{
  const button=event.target.closest("button");
  if(!button) return;
  const id=button.dataset.profile||button.dataset.salary;
  if(id) showDetails(employees.find(row=>row.id===id),Boolean(button.dataset.salary));
  if(button.hasAttribute("data-print")) window.print();
  if(button.hasAttribute("data-export")) downloadCsv();
});
window.addEventListener("hashchange",()=>{render();content.focus();});
render();
