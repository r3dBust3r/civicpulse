---
name: work-order-synthesis
description: Autonomous engineering skill that transforms detected civic issues into actionable municipal repair orders with crew allocation, materials list, and safety advisories.
version: 1.0.0
author: CivicPulse Team (Hacktoberfest Rabat x ForgeBots UM6P)
tags: [civic-ai, gemma-4, agent-skill-open-standard, logistics, smart-city]
---

# Municipal Work Order Synthesis Skill

## Purpose
Bridges the gap between raw citizen reports and city municipal maintenance teams by autonomously formulating a concrete technical intervention plan.

## Target Model
- **Google Gemma 4** (MoE open-weight architecture)

## Operational Workflow
1. **Defect Analysis**:
   - Assess estimated physical requirements based on category and severity (e.g., asphalt patch, electrical replacement, heavy waste removal).
2. **Crew Assignment**:
   - Recommend the specific municipal unit (e.g., *Voirie & Enrobé Équipe 2*, *Service Éclairage Public*, *Brigade Propreté Urbaine*).
3. **Materials & Equipment List**:
   - Estimate items required for the field crew (e.g., *2x 25kg cold-asphalt bags, hand tamper, safety cones*, or *Replacement LED luminaire, bucket truck*).
4. **Immediate Safety Advisory**:
   - Suggest immediate precautions (e.g., *Deploy reflective warning barriers due to curve in road*, *Shut off circuit breaker at sub-station 4*).
5. **Estimated Repair Duration**:
   - Expected turnaround window (e.g., *Within 12 hours*, *24–48 hours*).

## Structured Output Schema
```json
{
  "department": "Direction des Travaux Publics et Voirie",
  "recommended_crew": "Asphalt Quick-Response Unit",
  "materials_needed": ["Cold-mix asphalt (50kg)", "Vibratory plate compactor", "Traffic safety cones (x4)"],
  "safety_advisory": "High traffic zone; place warning signs 30m prior to hazard.",
  "estimated_resolution_time": "24 hours"
}
```
