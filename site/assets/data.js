// Fictional fixtures manually transcribed from the public demo specification.
const roster = [
  ["Ayesha Rahman","Data Science Trainer","Data Science",30000],
  ["Rahul Gowda","Python Trainer","Programming",28000],
  ["Meera Iyer","Data Analytics Trainer","Data Analytics",29000],
  ["Imran Shaikh","Web Development Trainer","Web Development",27000],
  ["Kavya Rao","Power BI Trainer","Data Analytics",26000],
  ["Naveen Kumar","Programming Trainer","Programming",24000],
  ["Sana Farheen","Soft Skills Trainer","Soft Skills",23000],
  ["Pranav Shetty","Aptitude Trainer","Aptitude",22000],
  ["Farhan Ali","AI/ML Trainer","Artificial Intelligence",31000],
  ["Divya Nair","English Trainer","Communication",22000],
  ["Rakesh M","Office Administrator","Administration",20000],
  ["Lakshmi S","Accountant","Accounts",22000],
  ["Nikhil P","Receptionist","Front Office",17000],
  ["Priya K","Lab Assistant","Technical Support",18000],
  ["Harish M","Support Staff","Operations",16000],
];
export const employees = Object.freeze(roster.map(([name, designation, department, basic], i) => {
  const allowances = [2000, 1500, 750][i % 3];
  const bonus = i % 4 === 0 ? 1000 : 0;
  const other = i % 2 === 0 ? 0 : 250;
  const deductions = [500, 0, 250][i % 3];
  const gross = basic + allowances + bonus + other;
  return Object.freeze({ id: "MAL" + String(i + 1).padStart(3,"0"), name, designation, department,
    category: i < 10 ? "Teaching" : "Non-teaching", basic, allowances, bonus, other,
    deductions, gross, net: gross - deductions, payment: "Unpaid" });
}));
export const periods = {
  october: { name: "October 2026", status: "Published" },
  november: { name: "November 2026", status: "Draft" },
};
export const money = new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"});
export function totals(rows) {
  return rows.reduce((sum,row) => ({
    gross: sum.gross + row.gross, deductions: sum.deductions + row.deductions, net: sum.net + row.net,
    paid: sum.paid + Number(row.payment === "Paid"), unpaid: sum.unpaid + Number(row.payment === "Unpaid"),
  }), {gross:0,deductions:0,net:0,paid:0,unpaid:0});
}
export function filterEmployees(rows,{search="",department="",category="",payment=""} = {}) {
  const query = search.trim().toLowerCase();
  return rows.filter(row => (!query || (row.name + " " + row.id).toLowerCase().includes(query))
    && (!department || department === row.department) && (!category || category === row.category)
    && (!payment || payment === row.payment));
}
export function salaryCsv(period,rows) {
  const escape = value => {
    const text = String(value);
    const safe = /^[=+\-@\t\r\n]/u.test(text) || /^[=+\-@]/u.test(text.trimStart()) ? "'" + text : text;
    return '"' + safe.replaceAll('"','""') + '"';
  };
  const sum = totals(rows);
  const values = [
    ["Period","Status","Employee ID","Name","Department","Category","Gross (INR)","Deductions (INR)","Net (INR)","Payment"],
    ...rows.map(r => [period.name,period.status,r.id,r.name,r.department,r.category,r.gross.toFixed(2),r.deductions.toFixed(2),r.net.toFixed(2),r.payment]),
    [period.name,period.status,"","Total","","",sum.gross.toFixed(2),sum.deductions.toFixed(2),sum.net.toFixed(2),""],
  ];
  return "\ufeff" + values.map(row => row.map(escape).join(",")).join("\r\n") + "\r\n";
}
