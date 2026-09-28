/** In-memory users — class tblusers jaisa sample. QUERY inhe filter karti hai, POST add. */
export const users = [
  { uid: 1, name: "alok", gender: "male", salary: 13000, dob: "1984-10-04", country: 1 },
  { uid: 2, name: "monika", gender: "female", salary: 15000, dob: "1990-10-04", country: 2 },
  { uid: 3, name: "javed", gender: "male", salary: 11000, dob: "1981-10-04", country: 3 },
  { uid: 4, name: "harish", gender: "transgender", salary: 18000, dob: "1983-10-04", country: 3 },
  { uid: 5, name: "seema", gender: "female", salary: 17000, dob: "1982-10-04", country: 2 },
  { uid: 6, name: "tarun", gender: "transgender", salary: 16000, dob: "1993-10-04", country: 1 },
  { uid: 7, name: "mohan", gender: "transgender", salary: 10000, dob: "1997-10-04", country: 1 },
  { uid: 8, name: "iqbal", gender: "male", salary: 14000, dob: "1999-10-04", country: 2 },
  { uid: 9, name: "sohan", gender: "male", salary: 15000, dob: "1990-10-04", country: 2 },
  { uid: 10, name: "sunita", gender: "female", salary: 19000, dob: "1991-10-04", country: 1 },
];

export function applyQuery(list, q) {
  let out = list.slice();
  if (q.name) {
    const n = String(q.name).toLowerCase();
    out = out.filter((u) => u.name.toLowerCase().includes(n));
  }
  if (q.gender) {
    out = out.filter((u) => u.gender === q.gender);
  }
  if (q.country !== undefined && q.country !== null && q.country !== "") {
    out = out.filter((u) => u.country === Number(q.country));
  }
  if (q.minSalary !== undefined && q.minSalary !== null && q.minSalary !== "") {
    out = out.filter((u) => u.salary >= Number(q.minSalary));
  }
  if (q.maxSalary !== undefined && q.maxSalary !== null && q.maxSalary !== "") {
    out = out.filter((u) => u.salary <= Number(q.maxSalary));
  }
  if (q.limit !== undefined && q.limit !== null && q.limit !== "") {
    out = out.slice(0, Number(q.limit));
  }
  return out;
}
