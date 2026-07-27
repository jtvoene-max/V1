const { Client } = require("pg");
const c = new Client({ connectionString: "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable" });
c.connect()
  .then(() => c.query("select table_name from information_schema.tables where table_schema='public' order by table_name"))
  .then((r) => { console.log(r.rows.map((x) => x.table_name).join(", ")); return c.end(); })
  .catch((e) => { console.error("FOUT:", e.message); process.exit(1); });
