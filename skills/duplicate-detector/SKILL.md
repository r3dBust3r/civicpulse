---
name: duplicate-detector
description: Spatial and semantic deduplication skill that identifies matching civic reports within geographic proximity to prevent redundant municipal tickets and aggregate citizen concern.
version: 1.0.0
author: CivicPulse Team (Hacktoberfest Rabat x ForgeBots UM6P)
tags: [civic-ai, gemma-4, agent-skill-open-standard, spatial-ai, deduplication]
---

# Spatial-Semantic Duplicate Detection Skill

## Purpose
Prevents municipal dispatch overload by comparing incoming reports against nearby active tickets (< 60 meters radius) using Gemma 4 semantic comparison.

## Target Model
- **Google Gemma 4** (Fast MoE reasoning via Gemini API)

## Input Specification
- `candidate_report`: New report details (category, description, image cues, exact coords).
- `nearby_open_reports`: Array of existing active reports within 60 meters.

## Operational Workflow
1. Calculate geographic distance (Haversine formula).
2. For reports within distance threshold, evaluate semantic match:
   - Does candidate describe the same physical object or defect?
   - Is it the same pothole, same pile of trash, or same broken pole?
3. Output classification:
   - `is_duplicate`: boolean
   - `matched_report_id`: ID of the original report if matched
   - `confidence`: 0.0 to 1.0
   - `reasoning`: Brief explanation of similarity.
