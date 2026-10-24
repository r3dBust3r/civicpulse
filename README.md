# 🏙️ CivicPulse Rabat — Community-Driven Civic AI (with Google Gemma 4)

Online Demo Link: [https://civicpulse-rabat.duckdns.org/](https://civicpulse-rabat.duckdns.org/)

> **Hacktoberfest Hack Day Rabat x ForgeBots Club UM6P**  
> Targeting Challenges:  
> 1. 🏆 **Best Open-Source AI Project** (Agent Skill Open Standard)  
> 2. ⚡ **Best Use of Gemma 4** (Google Gemma 4 via Gemini API)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Model: Google Gemma 4](https://img.shields.io/badge/Model-Google%20Gemma%204-blue)](https://openrouter.ai/google/gemma-4-26b-a4b-it:free)
[![Standard: Agent Skill Open Standard](https://img.shields.io/badge/Standard-Agent%20Skill%20Open%20Standard-green)](https://dev.to/loc_carrre_0d798813c662/agent-skills-explained-what-they-are-what-they-arent-and-how-to-use-them-bf9)

---

## 👥 The Team

Proudly developed for **Hacktoberfest Hack Day Rabat x ForgeBots Club UM6P**:

- **Hamid Ryahi**
- **Otmane TALHAOUI**
- **Mohammed Mokhliss**

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
| **🗺️ Minimalist Full-Screen Map** | Landing page displays an interactive OpenStreetMap canvas of Rabat with auto-rendering teardrop problem pinpoints color-coded by severity. |
| **📸 Photo-First AI Triage** | Bottom camera button (`📸`) opens an instant photo-first submission form. Gemma 4 auto-generates a title, category, and minimalist description. |
| **📍 3-Way Location Bar** | 1) **Device GPS** with dual-tier hardware/Wi-Fi lock + 1-tap Rabat presets, 2) **Manual Map Point** with draggable mini-map pin, 3) **Photo EXIF** metadata extraction. |
| **🎙️ Moroccan Voice Note & ASR** | Live synchronous Web Speech Recognition supporting **Moroccan Darija (`ar-SA`)**, French (`fr-FR`), and English (`en-US`), with parallel `MediaRecorder` audio playback. |
| **🤝 Community Action Plan** | Replaces bureaucratic tickets with actionable neighborhood volunteer plans, required tools, and safety warnings. |
| **📸 Photo Proof Resolution** | Citizens mark problems fixed by providing photographic evidence, generating a side-by-side **Before & After** verification view. |
| **🛡️ Spatial Duplicate Detection** | Automatically flags active issues within 60 meters to prevent duplicate tickets and pool community upvotes. |
| **🔊 Civic Audio Readback** | Web Speech Synthesis reads triage results aloud for hands-free and accessibility support. |

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v22/v26)
- (Optional) A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/civicpulse-rabat.git
cd civicpulse-rabat
npm install
```

### 3. Environment Configuration (Optional)
Create a `.env.local` file:
```env
# Gemini API Key (for Google Gemma 4 live multimodal vision)
GEMINI_API_KEY=your_gemini_api_key_here
```
*(You can also connect your key directly inside the web UI using the **Connect Vision Key** button!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser or mobile phone.

---

## 📂 Project Architecture

```
├── app/
│   ├── api/analyze-issue/route.ts  # Gemma 4 Multimodal Agent & Skill Execution
│   ├── globals.css                 # Tailwind CSS & Leaflet map styling
│   ├── layout.tsx                  # Root layout, app icon & metadata
│   └── page.tsx                    # Minimalist Full-Screen Map & Controls
├── components/
│   ├── CivicMap.tsx                # Leaflet map with custom teardrop pins & Hazard Heatmap
│   ├── LocationPickerMap.tsx       # Draggable pinpoint mini-map in report wizard
│   ├── NewReportModal.tsx          # Incident submission wizard & photo AI triage
│   ├── ReportDetailsModal.tsx      # Before & After photo comparison & community action plan
│   ├── ResolveProofModal.tsx       # Citizen photo proof submission for fixed issues
│   └── VoiceRecorder.tsx           # Moroccan Darija ASR & MediaRecorder audio capture
├── lib/
│   ├── geoUtils.ts                 # Haversine distance, deduplication & reverse geocoding
│   └── mockData.ts                 # Authentic seed incidents around Rabat (Agdal, Hassan, Médina, UM6P)
├── skills/                         # Agent Skill Open Standard Directory
│   ├── community-action-synthesis/SKILL.md
│   ├── duplicate-detector/SKILL.md
│   └── visual-hazard-inspection/SKILL.md
├── types/                          # Strict TypeScript definitions
├── icon.ico                        # Official platform icon
├── LICENSE                         # MIT License
└── README.md                       # Documentation & Hackathon Challenge Alignment
```

---

## 📜 Open Source License

This project is licensed under the [MIT License](LICENSE). Built with pride by **Hamid Ryahi**, **Otmane TALHAOUI**, and **Mohammed Mokhliss** for **Hacktoberfest Hack Day Rabat x ForgeBots Club UM6P 2026**.
