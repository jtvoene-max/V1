const { Client } = require("pg");
const c = new Client({ connectionString: "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable" });
c.connect()
  .then(() => c.query(`select email, name, "accountType", "companyName", "vatNumber", "kvkNumber", role from "User" where email = 'nieuw-zakelijk@test.local'`))
  .then((r) => { console.log(JSON.stringify(r.rows, null, 2)); return c.end(); })
  .catch((e) => { console.error("FOUT:", e.message); process.exit(1); });
