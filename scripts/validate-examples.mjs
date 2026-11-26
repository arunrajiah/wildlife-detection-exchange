// Validates every file in examples/ against the WDX schemas.
// Detection events go against schema/detection-event.schema.json,
// records with "kind": "device-status" against schema/device-status.schema.json.
// Also checks that the v0.1.0 release examples (tests/v0.1) are still accepted.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const event = ajv.compile(read("schema/detection-event.schema.json"));
const status = ajv.compile(read("schema/device-status.schema.json"));

let failed = 0;
const versions = new Set();
for (const name of readdirSync(join(root, "examples")).filter((f) => f.endsWith(".json")).sort()) {
  const doc = read(join("examples", name));
  const items = Array.isArray(doc) ? doc : [doc];
  for (const item of items) {
    const validate = item.kind === "device-status" ? status : event;
    if (validate(item)) {
      if (validate === event) versions.add(item.wdx);
      console.log(`ok    ${name} (wdx ${item.wdx}${validate === status ? ", device status" : ""})`);
    } else {
      failed++;
      console.log(`FAIL  ${name}`);
      for (const e of validate.errors) console.log(`      ${e.instancePath || "/"} ${e.message}`);
    }
  }
}

// The examples exactly as published in the v0.1.0 release (tests/v0.1) must still validate.
for (const name of readdirSync(join(root, "tests/v0.1")).filter((f) => f.endsWith(".json")).sort()) {
  const doc = read(join("tests/v0.1", name));
  if (event(doc)) console.log(`ok    v0.1.0 release: ${name}`);
  else {
    failed++;
    console.log(`FAIL  v0.1.0 release: ${name}`);
    for (const e of event.errors) console.log(`      ${e.instancePath || "/"} ${e.message}`);
  }
}

// Guard against a validator that accepts anything: an unknown version must fail.
const bad = { ...read("examples/birdnet-pi.json"), wdx: "0.5" };
if (event(bad)) { failed++; console.log("FAIL  an event with wdx 0.5 was accepted"); }
else console.log("ok    an event with wdx 0.5 is rejected");

if (!versions.has("0.1")) { failed++; console.log("FAIL  no v0.1 example in examples/"); }
const enumVersions = read("schema/detection-event.schema.json").properties.wdx.enum;
const current = enumVersions[enumVersions.length - 1];
if (!versions.has(current)) { failed++; console.log(`FAIL  no example for the current version ${current}`); }

console.log(failed ? `\n${failed} failed` : `\nall passed (versions shown: ${[...versions].sort().join(", ")})`);
process.exit(failed ? 1 : 0);
