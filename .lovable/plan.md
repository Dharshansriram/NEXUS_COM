

# Smart PC Component Recommendation & Comparison System

## Overview
A modern, dark-themed web app where users input their PC usage requirements and get intelligent component recommendations with a comparison tool. Built with React + Supabase.

---

## Page 1: Dashboard / Home
- Hero section with app branding ("PC Build Advisor")
- Quick-start cards: "Get Recommendations" and "Compare Components"
- Dark theme throughout with accent colors

## Page 2: Requirement Form
- **Usage Type** selector (Gaming, Programming, Editing, AI/ML, Student, Office)
- **Budget Range** slider (optional)
- **Performance Priority** toggle (Performance / Balanced / Power Efficient)
- **Preferred Brand** dropdown (optional — AMD, Intel, NVIDIA, etc.)
- Submit button → navigates to results

## Page 3: Recommendation Results
- Full PC build recommendation displayed as cards:
  - CPU, GPU, Motherboard, RAM, Storage, PSU, Cabinet, Cooling
- Each card shows key specs, compatibility badges, and benchmark scores
- **Bottleneck indicator** — visual warning if any component pairing is mismatched
- **Alternative suggestions** — secondary picks for each category
- "Compare" button on individual components to add to comparison

## Page 4: Component Comparison
- Category selector (CPU, GPU, RAM, Storage)
- Multi-select dropdown to pick 2-4 components to compare
- Side-by-side comparison table with all specs
- Visual bar charts for benchmark scores, power consumption, etc.

---

## Database (Supabase / PostgreSQL)
Tables for each component type with full specs:
- **cpus**: name, brand, cores, threads, socket, tdp, benchmark_score, supported_ram_type, price_tier
- **gpus**: name, brand, vram, benchmark_score, power_consumption, price_tier
- **motherboards**: name, socket, chipset, ram_support, form_factor, price_tier
- **ram**: name, capacity, type, speed, price_tier
- **storage**: name, type (SSD/HDD/NVMe), capacity, speed, price_tier
- **psus**: name, wattage, efficiency_rating, price_tier
- **cooling**: name, type (air/AIO/custom), supported_sockets, price_tier
- **cabinets**: name, form_factor, price_tier

All tables seeded with ~15-25 realistic components each.

## Recommendation Engine (Edge Function)
- `POST /recommend` — accepts user requirements, returns matched build
- Logic:
  - Filter by usage type → score-weighted component selection
  - Socket compatibility matching (CPU ↔ Motherboard)
  - RAM type compatibility (CPU/Motherboard ↔ RAM)
  - PSU wattage calculation based on CPU TDP + GPU power
  - Bottleneck detection (CPU vs GPU benchmark score ratio)
  - Budget filtering when specified
  - Brand preference filtering

## Component API (Edge Function)
- `GET /components` — list components by category with filtering
- `GET /compare` — compare selected components by IDs

## Design
- Modern dark theme with gradient accents
- Responsive layout (mobile-friendly)
- Card-based UI with subtle animations
- Color-coded compatibility/bottleneck indicators

