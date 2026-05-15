/**
 * Seed MongoDB with demo hardware (compatible AM5 + DDR5 stack) if collections are empty.
 * Run from project root: node server/scripts/seedDemoData.mjs
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..", "..");

function loadEnv() {
  const candidates = [
    path.join(process.cwd(), ".env"),
    path.join(process.cwd(), ".env.local"),
    path.join(projectRoot, ".env"),
    path.join(projectRoot, ".env.local"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      console.log("Using env file:", p);
      return;
    }
  }
  dotenv.config();
}
loadEnv();

const uri = process.env.MONGODB_URI?.trim();
const dbName = (process.env.MONGODB_DB_NAME || "component_compass").trim();

if (!uri) {
  console.error("MONGODB_URI is missing.");
  console.error("Create a file named .env in this folder with:");
  console.error("  MONGODB_URI=mongodb+srv://...");
  console.error("  MONGODB_DB_NAME=component_compass");
  console.error("Tried:", [path.join(process.cwd(), ".env"), path.join(projectRoot, ".env")].join(", "));
  process.exit(1);
}

const cpus = [
  {
    name: "Ryzen 7 7800X3D",
    brand: "AMD",
    cores: 8,
    threads: 16,
    socket: "AM5",
    tdp: 120,
    benchmark_score: 28500,
    supported_ram_type: "DDR5",
    price_tier: "high",
  },
  {
    name: "Core i5-13600K",
    brand: "Intel",
    cores: 14,
    threads: 20,
    socket: "LGA1700",
    tdp: 125,
    benchmark_score: 24200,
    supported_ram_type: "DDR4",
    price_tier: "mid",
  },
];

const gpus = [
  {
    name: "RTX 4070",
    brand: "NVIDIA",
    vram: 12,
    benchmark_score: 18500,
    power_consumption: 200,
    price_tier: "high",
  },
  {
    name: "RX 7600",
    brand: "AMD",
    vram: 8,
    benchmark_score: 11200,
    power_consumption: 165,
    price_tier: "mid",
  },
];

const motherboards = [
  {
    name: "B650 Gaming WiFi",
    socket: "AM5",
    chipset: "B650",
    ram_support: "DDR5",
    form_factor: "ATX",
    price_tier: "mid",
  },
  {
    name: "B760M Pro",
    socket: "LGA1700",
    chipset: "B760",
    ram_support: "DDR4",
    form_factor: "mATX",
    price_tier: "mid",
  },
];

const ram = [
  { name: "DDR5-6000 32GB Kit", brand: "Example", capacity: 32, type: "DDR5", speed: 6000, price_tier: "high" },
  { name: "DDR4-3200 16GB Kit", brand: "Example", capacity: 16, type: "DDR4", speed: 3200, price_tier: "budget" },
];

const storage = [
  { name: "NVMe Gen4 1TB", brand: "Example", type: "NVMe", capacity: 1000, speed: 7000, price_tier: "mid" },
  { name: "SATA SSD 500GB", brand: "Example", type: "SSD", capacity: 500, speed: 550, price_tier: "budget" },
];

const psus = [
  { name: "850W Gold Modular", brand: "Example", wattage: 850, efficiency_rating: "80+ Gold", price_tier: "high" },
  { name: "650W Bronze", brand: "Example", wattage: 650, efficiency_rating: "80+ Bronze", price_tier: "mid" },
];

const cooling = [
  {
    name: "Dual Tower Air AM5",
    brand: "Example",
    type: "air",
    supported_sockets: ["AM5", "AM4"],
    price_tier: "mid",
  },
  {
    name: "240mm AIO",
    brand: "Example",
    type: "AIO",
    supported_sockets: ["AM5", "LGA1700"],
    price_tier: "high",
  },
];

const cabinets = [
  { name: "Mid Tower ATX Mesh", brand: "Example", form_factor: "ATX", price_tier: "mid" },
  { name: "Compact mATX", brand: "Example", form_factor: "mATX", price_tier: "budget" },
];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const now = new Date();
  const stamp = (docs) => docs.map((d) => ({ ...d, created_at: now }));

  for (const [coll, docs] of [
    ["cpus", stamp(cpus)],
    ["gpus", stamp(gpus)],
    ["motherboards", stamp(motherboards)],
    ["ram", stamp(ram)],
    ["storage", stamp(storage)],
    ["psus", stamp(psus)],
    ["cooling", stamp(cooling)],
    ["cabinets", stamp(cabinets)],
  ]) {
    const n = await db.collection(coll).countDocuments();
    if (n === 0) {
      await db.collection(coll).insertMany(docs);
      console.log(`Seeded ${coll}: ${docs.length} documents`);
    } else {
      console.log(`Skip ${coll}: already has ${n} documents`);
    }
  }

  await client.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
