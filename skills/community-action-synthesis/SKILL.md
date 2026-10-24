---
name: community-action-synthesis
description: Open-source community action synthesis skill using Google Gemma 4 to formulate volunteer repair plans, safety advisories, and required tools for neighborhood self-organization.
version: 1.0.0
author: CivicPulse Rabat Community (Hacktoberfest Rabat x ForgeBots UM6P)
tags: [civic-ai, gemma-4, agent-skill-open-standard, open-source-community, rabat]
---

# Community Action Synthesis Skill

## Purpose
Enables a 100% community-driven civic platform where citizens not only report problems, but collaboratively coordinate solutions, organize volunteer interventions, and verify resolutions—just like an open-source project.

## Target Model
- **Google Gemma 4** (26B MoE instruction-tuned model via Gemini API)

## Operational Workflow
1. **Community Impact Assessment**:
   - Determine how this street issue affects pedestrians, students, cyclists, and vehicles in Rabat.
2. **Action Plan Formulation**:
   - Formulate a clear, direct neighborhood action plan (e.g., *Deploy caution warning markers*, *Organize weekend cleanup*, *Apply temporary cold asphalt patch*).
3. **Required Community Tools**:
   - Suggest readily available tools community volunteers can bring (e.g., *Reflective cones, gloves, heavy-duty bags, insulating tape*).
4. **Safety Warning**:
   - Explicit hazard advisory for neighbors and volunteers.

## Output Schema
```json
{
  "action_plan": "Clear step-by-step community response plan",
  "required_tools": ["Tool 1", "Tool 2"],
  "safety_warning": "Important community safety warning",
  "suggested_resolution": "Ideal fix to restore the space"
}
```
