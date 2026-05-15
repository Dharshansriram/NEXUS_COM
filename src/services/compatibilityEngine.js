function analyzeCompatibility(build) {
  const checks = [];
  const socketMatch = build.cpu.socket === build.motherboard.socket;
  checks.push({
    label: "CPU \u2194 Motherboard Socket",
    detail: socketMatch ? `Both use ${build.cpu.socket} \u2014 perfect match` : `CPU (${build.cpu.socket}) \u2260 Motherboard (${build.motherboard.socket}) \u2014 INCOMPATIBLE`,
    pass: socketMatch
  });
  const ramMatch = build.ram.type === build.cpu.supported_ram_type;
  checks.push({
    label: "RAM \u2194 CPU Memory Controller",
    detail: ramMatch ? `${build.ram.type} supported by CPU \u2014 compatible` : `RAM (${build.ram.type}) not supported by CPU (requires ${build.cpu.supported_ram_type})`,
    pass: ramMatch
  });
  const mbRamMatch = build.ram.type === build.motherboard.ram_support;
  checks.push({
    label: "RAM \u2194 Motherboard Slots",
    detail: mbRamMatch ? `Motherboard supports ${build.ram.type} \u2014 compatible` : `Motherboard supports ${build.motherboard.ram_support}, RAM is ${build.ram.type}`,
    pass: mbRamMatch
  });
  const totalPower = build.cpu.tdp + build.gpu.power_consumption + 150;
  const psuHeadroom = build.psu.wattage - totalPower;
  const psuOk = psuHeadroom >= 0;
  checks.push({
    label: "PSU Wattage Adequacy",
    detail: psuOk ? `${build.psu.wattage}W PSU for ${totalPower}W system \u2014 ${psuHeadroom}W headroom` : `${build.psu.wattage}W PSU insufficient for ${totalPower}W system \u2014 ${Math.abs(psuHeadroom)}W short`,
    pass: psuOk
  });
  const coolingOk = build.cooling.supported_sockets?.includes(build.cpu.socket) ?? false;
  checks.push({
    label: "Cooler \u2194 CPU Socket",
    detail: coolingOk ? `Cooler supports ${build.cpu.socket} \u2014 compatible` : `Cooler may not support ${build.cpu.socket}`,
    pass: coolingOk
  });
  const caseOk = build.cabinet.form_factor === build.motherboard.form_factor || build.cabinet.form_factor === "ATX";
  checks.push({
    label: "Case \u2194 Motherboard Form Factor",
    detail: caseOk ? `${build.cabinet.form_factor} case fits ${build.motherboard.form_factor} board` : `${build.cabinet.form_factor} case may not fit ${build.motherboard.form_factor} board`,
    pass: caseOk
  });
  const storageOk = build.storage.type === "NVMe" || build.storage.type === "SSD";
  checks.push({
    label: "Storage Interface",
    detail: `${build.storage.type} ${build.storage.capacity}GB at ${build.storage.speed} MB/s \u2014 ${storageOk ? "modern interface" : "legacy interface"}`,
    pass: storageOk
  });
  const passCount = checks.filter((c) => c.pass).length;
  const compatibilityScore = Math.round(passCount / checks.length * 100);
  const coolingCapacity = build.cooling.type === "custom" ? 300 : build.cooling.type === "AIO" ? 250 : 150;
  const thermalLoad = build.cpu.tdp + build.gpu.power_consumption * 0.3;
  const thermalRisk = Math.min(100, Math.max(0, Math.round((thermalLoad / coolingCapacity - 0.5) * 100)));
  const ratio = build.cpu.benchmark_score / build.gpu.benchmark_score;
  const bottleneckPct = Math.min(100, Math.round(Math.abs(1 - ratio) * 50));
  return { compatibilityScore, thermalRisk, bottleneckPct, checks };
}
export {
  analyzeCompatibility
};
