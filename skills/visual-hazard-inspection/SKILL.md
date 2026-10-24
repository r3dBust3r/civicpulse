---
name: visual-hazard-inspection
description: Multimodal inspection skill using Gemma 4 to analyze street photos and voice notes, classify urban hazards, assess severity, and check citizen privacy compliance.
version: 1.0.0
author: CivicPulse Team (Hacktoberfest Rabat x ForgeBots UM6P)
tags: [civic-ai, gemma-4, open-weight, agent-skill-open-standard, vision]
---

# Visual Hazard Inspection Skill

## Purpose
This skill equips the civic agent to inspect user-submitted street photographs alongside optional citizen voice narrations to detect, classify, and rate infrastructure hazards in public spaces.

## Target Model
- **Google Gemma 4** (MoE multimodal instruction-tuned model via Gemini API)

## Input Specification
- `image`: Base64 encoded JPEG/PNG image taken in a public space.
- `voice_context`: Optional text transcription of citizen's spoken description (may be in Moroccan Darija, French, Arabic, or English).
- `location_hint`: Geolocation coordinates and reverse-geocoded street name.

## Operational Workflow
1. **Visual Scan**:
   - Detect primary physical issue (Pothole, Broken Pavement, Accumulation of Garbage / Illegal Dumping, Broken Streetlight, Damaged Traffic Sign, Exposed Electrical Cable, Open Drain / Manhole, Water Main Leak, Graffiti / Vandalism).
2. **Context Fusion**:
   - Merge visual observation with `voice_context`. If citizen voice notes mention hidden hazards (e.g., "toxic smell", "sparks flying at night", "deep water hole after rain"), escalate urgency appropriately.
3. **Urgency & Severity Indexing**:
   - `Critical`: Immediate physical danger to life, pedestrians, or vehicle collision risk.
   - `High`: Significant impediment to traffic, deep road hazard, or active water/sanitation rupture.
   - `Medium`: Nuisance, localized litter, broken paving stone without tripping drop.
   - `Low`: Cosmetic issue, faded road paint, minor surface wear.
   - Compute `urgency_score` as an integer from 1 to 10.
4. **Privacy & Anonymization Audit**:
   - Verify if human faces or vehicle license plates are prominent. Flag `privacy_vetted: true` for civic open-data publishing.

## Structured Output Schema
The skill must return clean JSON conforming to:
```json
{
  "title": "Short descriptive title (max 8 words)",
  "category": "Pothole | Sanitation | Lighting | Water & Drainage | Road Hazard | Vandalism",
  "severity": "Critical | High | Medium | Low",
  "urgency_score": 8,
  "description": "Factual description of the defect, dimensions, and danger context.",
  "privacy_vetted": true
}
```
