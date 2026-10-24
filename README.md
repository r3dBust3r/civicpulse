# 🏙️ CivicPulse Rabat — Community-Driven Civic AI (with Google Gemma 4)

> **Hacktoberfest Hack Day Rabat x ForgeBots Club UM6P**  
> Targeting Challenges:  
> 1. 🏆 **Best Open-Source AI Project** (Agent Skill Open Standard)  
> 2. ⚡ **Best Use of Gemma 4** (Google Gemma 4 via Gemini API)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Model: Google Gemma 4](https://img.shields.io/badge/Model-Google%20Gemma%204-blue)](https://openrouter.ai/google/gemma-4-26b-a4b-it:free)
[![Standard: Agent Skill Open Standard](https://img.shields.io/badge/Standard-Agent%20Skill%20Open%20Standard-green)](https://dev.to/loc_carrre_0d798813c662/agent-skills-explained-what-they-are-what-they-arent-and-how-to-use-them-bf9)

---

## 📌 Executive Summary

**CivicPulse Rabat** is an open-source, 100% community-driven civic platform for Rabat city. Built like an open-source collaboration tool (such as OpenStreetMap or Wikipedia), citizens submit infrastructure issues (potholes, trash accumulation, exposed wires, broken drains) and community members collaboratively identify, fix, and verify resolved problems using **photo proof**.

The platform is powered by an autonomous civic agent executing modular skills under the **Agent Skill Open Standard**. Using **Google Gemma 4** (26B MoE instruction-tuned model via Gemini API), CivicPulse analyzes street photographs alongside citizen voice notes (in Moroccan Darija, French, or English), assesses physical danger, detects spatial duplicates, and synthesizes actionable **Community Action Plans** with suggested volunteer tools and safety warnings.

---

## 🌟 Why Gemma Matters for Civic Infrastructure

The hackathon guidelines explicitly request a note on why Gemma matters:

1. **Edge Privacy & Citizen Anonymization**: Citizen street photos inevitably capture residential windows, passerby faces, and vehicle license plates. Proprietary black-box cloud models force municipal and community platforms to export sensitive public space data into private corporate silos. With Google's open-weight **Gemma 4**, communities and cities retain complete **data sovereignty**, enabling sovereign inference where citizen data never leaves local borders.
2. **MoE Compute Efficiency**: Gemma 4's 26B Mixture-of-Experts architecture activates only ~3.8B parameters during inference. This delivers state-of-the-art multimodal vision triage with near-instant response times on low-cost compute—critical for community-run and public sector platforms in Morocco.
3. **Open-Weight Auditability & Public Accountability**: Civic platforms require transparent, deterministic, and auditable decision logic. Closed commercial APIs change without notice. An open-weight model ensures repeatable and verifiable triage that communities and citizens can audit.

---

## 🎯 Target Hackathon Challenges Alignment

### 1. Best Open-Source AI Project
* Fully open-source under the **MIT License**.
* Skills follow the **Agent Skill Open Standard** (`SKILL.md`) in the `skills/` directory:
  * [`skills/visual-hazard-inspection/SKILL.md`](skills/visual-hazard-inspection/SKILL.md): Multimodal inspection, damage classification, and Urgency Score calculation (1–10).
  * [`skills/community-action-synthesis/SKILL.md`](skills/community-action-synthesis/SKILL.md): Formulates community volunteer action plans, required tools, and neighborhood safety notes.
  * [`skills/duplicate-detector/SKILL.md`](skills/duplicate-detector/SKILL.md): Spatial-semantic deduplication within 60 meters.
* Dynamic skill loader (`loadAgentSkills()`) injects markdown specifications directly into the agent workflow.

### 2. Best Use of Gemma 4 (via Gemini API)
* Model: **Google Gemma 4** (26B A4B MoE instruction-tuned model).
* Integration visible in [`app/api/analyze-issue/route.ts`](app/api/analyze-issue/route.ts).
* Supports standard `GEMINI_API_KEY` (Gemini API endpoint) with OpenRouter fallback.
* Multimodal fusion: Evaluates visual image tensor + citizen voice audio transcription simultaneously.

---

## 🛠️ Features Breakdown

| Feature | Description |
| :--- | :--- |
| **📸 3-Way Geolocation** | 1) Automatic EXIF GPS extraction from photo metadata, 2) Browser Geolocation API, 3) Interactive mini-map pin with reverse geocoding to Rabat street addresses. |
| **🎙️ Moroccan ASR Voice Input** | Web Speech Recognition with native support for Moroccan Darija (`ar-MA`), French (`fr-FR`), and English (`en-US`). |
| **🧠 Gemma 4 Multimodal Triage** | Generates title, category, severity (`Critical`, `High`, `Medium`, `Low`), urgency score (1-10), and detailed damage analysis. |
| **🤝 Community Action Plan** | Replaces bureaucratic tickets with actionable neighborhood plans and volunteer tool checklists. |
| **📸 Photo Proof Resolution** | To mark an issue as fixed, citizens must provide a photo proof of the repaired street space, creating a side-by-side **Before & After** comparison. |
| **🛡️ Spatial Duplicate Detection** | Automatically flags active issues within 60m to prevent duplicate tickets and pool community upvotes. |
| **🗺️ Rabat Teardrop Pinpoints** | Clean custom teardrop markers on Leaflet OpenStreetMap with live Hazard Heatmap and Rabat neighborhood filters (*Agdal, Hassan, Médina, Technopolis UM6P*). |
| **🔊 Civic Audio Readback** | Web Speech Synthesis reads triage results aloud for accessibility. |

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v22/v26)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/civicpulse-rabat.git
cd civicpulse-rabat
npm install
```

### 3. Environment Configuration
Create a `.env.local` file:
```env
# Gemini API Key (for Google Gemma 4 multimodal analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenRouter key
OPENROUTER_API_KEY=
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

---

## 📂 Project Architecture

```
├── app/
│   ├── api/analyze-issue/route.ts  # Gemma 4 Multimodal Agent & Skill Execution
│   ├── globals.css                 # Tailwind CSS & Leaflet map styles
│   ├── layout.tsx                  # Root layout & responsive meta tags
│   └── page.tsx                    # Main Community Dashboard, Map & Feed
├── components/
│   ├── CivicMap.tsx                # Leaflet map with custom teardrop pins & Heatmap
│   ├── ImageCapture.tsx            # Camera capture & EXIF GPS extractor
│   ├── LocationPickerMap.tsx       # Draggable pinpoint mini-map in report wizard
│   ├── NewReportModal.tsx          # Incident submission wizard & duplicate check
│   ├── ReportDetailsModal.tsx      # Before & After photo comparison & community plan
│   ├── ResolveProofModal.tsx       # Take/upload photo proof of fixed problem
│   └── VoiceRecorder.tsx           # Moroccan ASR voice note component
├── lib/
│   ├── geoUtils.ts                 # Haversine distance & reverse geocoding
│   └── mockData.ts                 # Seed incidents around Rabat & UM6P Technopolis
├── skills/                         # Agent Skill Open Standard Directory
│   ├── community-action-synthesis/SKILL.md
│   ├── duplicate-detector/SKILL.md
│   └── visual-hazard-inspection/SKILL.md
├── types/                          # Strict TypeScript definitions
└── README.md
```

---

## 📜 Open Source License

This project is licensed under the [MIT License](LICENSE). Built with pride for **Hacktoberfest Hack Day Rabat x ForgeBots Club UM6P 2026**.
