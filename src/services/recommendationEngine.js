const USAGE_WEIGHTS = {
  gaming: { cpuWeight: 0.4, gpuWeight: 0.9, ramMin: 16, storageType: "NVMe" },
  programming: { cpuWeight: 0.7, gpuWeight: 0.3, ramMin: 32, storageType: "NVMe" },
  editing: { cpuWeight: 0.7, gpuWeight: 0.7, ramMin: 32, storageType: "NVMe" },
  ai_ml: { cpuWeight: 0.6, gpuWeight: 1, ramMin: 32, storageType: "NVMe" },
  student: { cpuWeight: 0.4, gpuWeight: 0.3, ramMin: 16, storageType: "SSD" },
  office: { cpuWeight: 0.3, gpuWeight: 0.2, ramMin: 16, storageType: "SSD" }
};
const TIER_ORDER = ["budget", "mid", "high", "premium"];
function tierMatch(tier, maxTier) {
  if (!maxTier) return true;
  return TIER_ORDER.indexOf(tier) <= TIER_ORDER.indexOf(maxTier);
}
function pickBest(items, maxTier, brand, brandField = "brand") {
  let filtered = items.filter((i) => tierMatch(i.price_tier, maxTier));
  if (brand && brand !== "none" && filtered.some((i) => i[brandField]?.toLowerCase() === brand.toLowerCase())) {
    filtered = filtered.filter((i) => i[brandField]?.toLowerCase() === brand.toLowerCase());
  }
  if (filtered.length === 0) filtered = items;
  return filtered.sort((a, b) => (b.benchmark_score ?? 0) - (a.benchmark_score ?? 0))[0];
}
async function fetchAllComponents() {
  const res = await fetch("/api/catalog");
  if (!res.ok) {
    let msg = `Catalog request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
    }
    throw new Error(msg);
  }
  const data = await res.json();
  return {
    cpus: data.cpus ?? [],
    gpus: data.gpus ?? [],
    motherboards: data.motherboards ?? [],
    rams: data.rams ?? [],
    storages: data.storages ?? [],
    psus: data.psus ?? [],
    coolings: data.coolings ?? [],
    cabinets: data.cabinets ?? []
  };
}
function buildStack(req, components, strategy) {
  const weights = { ...USAGE_WEIGHTS[req.usageType] };
  const { cpus, gpus, motherboards, rams, storages, psus, coolings, cabinets } = components;
  if (strategy === "efficiency") {
    weights.cpuWeight *= 0.7;
    weights.gpuWeight *= 0.6;
  } else if (strategy === "thermal") {
    weights.cpuWeight *= 0.8;
    weights.gpuWeight *= 0.7;
  } else if (strategy === "silent") {
    weights.cpuWeight *= 0.6;
    weights.gpuWeight *= 0.5;
  } else if (strategy === "upgrade") {
    weights.cpuWeight *= 0.9;
    weights.gpuWeight *= 0.8;
  }
  const cpuPool = cpus.map((c) => ({ ...c, benchmark_score: Math.round(c.benchmark_score * weights.cpuWeight) }));
  const cpu = pickBest(cpuPool, req.budgetTier, req.preferredBrand);
  const realCpu = cpus.find((c) => c.id === cpu.id);
  let finalCpu = realCpu;
  if (strategy === "efficiency" || strategy === "silent") {
    const lowTdp = cpus.filter((c) => tierMatch(c.price_tier, req.budgetTier)).sort((a, b) => a.tdp - b.tdp);
    if (lowTdp.length > 0) finalCpu = lowTdp[0];
  }
  const gpuPool = gpus.map((g) => ({ ...g, benchmark_score: Math.round(g.benchmark_score * weights.gpuWeight) }));
  const gpu = pickBest(gpuPool, req.budgetTier, req.preferredBrand);
  const realGpu = gpus.find((g) => g.id === gpu.id);
  let finalGpu = realGpu;
  if (!finalCpu || !finalGpu) {
    throw new Error("No compatible CPU/GPU found for selected filters");
  }
  if (strategy === "efficiency" || strategy === "silent") {
    const lowPower = gpus.filter((g) => tierMatch(g.price_tier, req.budgetTier)).sort((a, b) => a.power_consumption - b.power_consumption);
    if (lowPower.length > 0) finalGpu = lowPower[0];
  }
  const compatibleMbs = motherboards.filter(
    (mb) => mb.socket === finalCpu.socket && mb.ram_support === finalCpu.supported_ram_type
  );
  const motherboard = compatibleMbs.filter((mb) => tierMatch(mb.price_tier, req.budgetTier)).sort(
    (a, b) => TIER_ORDER.indexOf(b.price_tier) - TIER_ORDER.indexOf(a.price_tier)
  )[0] ?? compatibleMbs[0] ?? motherboards[0];
  const compatibleRam = rams.filter(
    (r) => r.type === finalCpu.supported_ram_type && r.capacity >= weights.ramMin
  );
  const ram = compatibleRam.filter((r) => tierMatch(r.price_tier, req.budgetTier)).sort(
    (a, b) => b.speed - a.speed
  )[0] ?? compatibleRam[0] ?? rams[0];
  const prefStorage = storages.filter((s) => s.type === weights.storageType);
  const storage = prefStorage.filter((s) => tierMatch(s.price_tier, req.budgetTier)).sort(
    (a, b) => b.speed - a.speed
  )[0] ?? prefStorage[0] ?? storages[0];
  const requiredWattage =
  (finalCpu?.tdp || 0) +
  (finalGpu?.power_consumption || 0) +
  150;
  const suitablePsus = psus.filter((p) => p.wattage >= requiredWattage);
  const psu = suitablePsus.filter((p) => tierMatch(p.price_tier, req.budgetTier)).sort(
    (a, b) => a.wattage - b.wattage
  )[0] ?? suitablePsus.sort((a, b) => a.wattage - b.wattage)[0] ?? psus[0];
  let compatibleCooling = coolings.filter((c) => c.supported_sockets.includes(finalCpu.socket));
  if (strategy === "thermal") {
    const aio = compatibleCooling.filter((c) => c.type === "AIO" || c.type === "custom");
    if (aio.length > 0) compatibleCooling = aio;
  } else if (strategy === "silent") {
    const air = compatibleCooling.filter((c) => c.type === "air");
    if (air.length > 0) compatibleCooling = air;
  }
  const cooling = compatibleCooling.filter((c) => tierMatch(c.price_tier, req.budgetTier))[0] ?? compatibleCooling[0] ?? coolings[0];
  const compatibleCabs = cabinets.filter((c) => c.form_factor === motherboard.form_factor || c.form_factor === "ATX");
  const cabinet = compatibleCabs.filter((c) => tierMatch(c.price_tier, req.budgetTier))[0] ?? compatibleCabs[0] ?? cabinets[0];
  let bottleneckWarning;
  const ratio =
  (finalCpu?.benchmark_score || 1) /
  (finalGpu?.benchmark_score || 1);
  if (ratio < 0.5) bottleneckWarning = "CPU bottleneck detected \u2014 your CPU may limit GPU performance.";
  else if (ratio > 2) bottleneckWarning = "GPU bottleneck detected \u2014 your GPU may limit overall performance.";
  const altCpus = cpus.filter((c) => c.id !== finalCpu.id && c.socket === finalCpu.socket && tierMatch(c.price_tier, req.budgetTier)).sort((a, b) => b.benchmark_score - a.benchmark_score).slice(0, 2);
  const altGpus = gpus.filter((g) => g.id !== finalGpu.id && tierMatch(g.price_tier, req.budgetTier)).sort((a, b) => b.benchmark_score - a.benchmark_score).slice(0, 2);
  return {
    cpu: finalCpu,
    gpu: finalGpu,
    motherboard,
    ram,
    storage,
    psu,
    cooling,
    cabinet,
    bottleneckWarning,
    alternatives: { cpu: altCpus, gpu: altGpus }
  };
}
async function getRecommendation(req) {
  const components = await fetchAllComponents();
  return buildStack(req, components, "performance");
}
async function getMultiStrategyRecommendation(req) {
  const components = await fetchAllComponents();
  return {
    performance: buildStack(req, components, "performance"),
    efficiency: buildStack(req, components, "efficiency"),
    thermal: buildStack(req, components, "thermal"),
    silent: buildStack(req, components, "silent"),
    upgrade: buildStack(req, components, "upgrade")
  };
}
async function getComponentsByCategory(category) {
  const res = await fetch(`/api/components/${encodeURIComponent(category)}`);
  if (!res.ok) {
    let msg = `Failed to load ${category}`;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
    }
    throw new Error(msg);
  }
  return res.json();
}
export {
  getComponentsByCategory,
  getMultiStrategyRecommendation,
  getRecommendation
};
