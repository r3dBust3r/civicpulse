import { CivicReport } from '@/types';

export const INITIAL_REPORTS: CivicReport[] = [
  {
    "id": "RBT-101",
    "title": "Severe road pothole near student pedestrian crossing",
    "category": "Pothole",
    "severity": "High",
    "urgency_score": 8,
    "description": "Deep pavement fracture and pothole measuring approx 45cm across. High risk for scooters and pedestrians crossing to campus.",
    "location": {
      "lat": 33.9876,
      "lng": -6.7268,
      "address": "Boulevard Technopolis, Sala Al Jadida (UM6P)",
      "neighborhood": "Technopolis (UM6P)",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Kayna wahed l-hofra kbira hna f triq qdam l-campus, t-tounobilat kayhrbo menha.",
    "community_action": {
      "action_plan": "Place reflective safety warning markers while community mobilizes quick-fill cold asphalt.",
      "required_tools": [
        "Safety cones / markers",
        "Cold-mix asphalt patch",
        "Hand tamper"
      ],
      "safety_warning": "Caution: Fast oncoming traffic around the campus bend.",
      "suggested_resolution": "Fill and level pothole with cold-mix asphalt."
    },
    "status": "Open",
    "upvotes": 9,
    "community_verifications": 6,
    "created_at": "2026-10-24T12:43:26.939Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-102",
    "title": "Exposed cable trench on campus access sidewalk",
    "category": "Road Hazard",
    "severity": "High",
    "urgency_score": 8,
    "description": "Open utility trench left unpaved on pedestrian pathway to UM6P engineering labs.",
    "location": {
      "lat": 33.9892,
      "lng": -6.7245,
      "address": "Rue de l'Innovation, Technopolis",
      "neighborhood": "Technopolis (UM6P)",
      "source": "manual"
    },
    "image_url": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Cover trench with steel footplate until permanent asphalt resurfacing.",
      "required_tools": [
        "Steel trench plate",
        "Caution hazard tape"
      ],
      "safety_warning": "High pedestrian traffic during morning lecture hours.",
      "suggested_resolution": "Trench backfilled and compacted with gravel bedding."
    },
    "status": "Open",
    "upvotes": 14,
    "community_verifications": 9,
    "created_at": "2026-10-24T09:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-103",
    "title": "Overflowing cardboard & packaging waste near tech incubator",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Cardboard packing boxes and plastic wrapping spilling past recycling containers.",
    "location": {
      "lat": 33.9915,
      "lng": -6.7291,
      "address": "Avenue de la Recherche, Technopolis",
      "neighborhood": "Technopolis (UM6P)",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Student green club cleanup drive to bundle cardboard for recycling.",
      "required_tools": [
        "Heavy twine",
        "Work gloves",
        "Recycling sacks"
      ],
      "safety_warning": "Flatten sharp box staples before bundling.",
      "suggested_resolution": "Cardboard bundled and transferred to designated recovery center."
    },
    "status": "In Progress",
    "upvotes": 7,
    "community_verifications": 4,
    "created_at": "2026-10-24T03:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-104",
    "title": "Flickering solar streetlamp at campus perimeter bus stop",
    "category": "Lighting",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Streetlight battery fixture cutting out intermittently after sunset leaving bus stop dark.",
    "location": {
      "lat": 33.9858,
      "lng": -6.7282,
      "address": "Arrêt Bus Technopolis Sud, Sala Al Jadida",
      "neighborhood": "Technopolis (UM6P)",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Check battery connection terminal and report photovoltaic controller fault.",
      "required_tools": [
        "Multimeter",
        "Insulated ladder"
      ],
      "safety_warning": "Do not handle wiring in wet weather.",
      "suggested_resolution": "Solar battery connection serviced and illumination restored."
    },
    "status": "Open",
    "upvotes": 11,
    "community_verifications": 5,
    "created_at": "2026-10-23T23:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-105",
    "title": "Restored campus drainage culvert after silt cleanout",
    "category": "Water & Drainage",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Campus storm drain culvert cleared of sand deposit by student volunteer crew.",
    "location": {
      "lat": 33.9888,
      "lng": -6.7219,
      "address": "Rocade Technopolis Est, UM6P",
      "neighborhood": "Technopolis (UM6P)",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T11:43:26.940Z",
      "note": "Culvert cleared of all sand blockages. Rainwater flowing unobstructed."
    },
    "community_action": {
      "action_plan": "Verified resolved by student engineering volunteer team.",
      "required_tools": [
        "Shovels",
        "Debris bags"
      ],
      "safety_warning": "Culvert is clear and stabilized.",
      "suggested_resolution": "Community verified with photo proof."
    },
    "status": "Resolved",
    "upvotes": 28,
    "community_verifications": 19,
    "created_at": "2026-10-23T09:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-106",
    "title": "Overflowing public waste bin along busy shopping sidewalk",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Street waste container overflowing onto the pedestrian pathway. Requires community cleanup initiative.",
    "location": {
      "lat": 34.0081,
      "lng": -6.8378,
      "address": "Avenue de France, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "exif"
    },
    "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Poubelle pleine depuis hier soir sur le trottoir piéton à Agdal.",
    "community_action": {
      "action_plan": "Community bag-and-tag effort; notify neighborhood volunteer squad.",
      "required_tools": [
        "Heavy-duty 100L trash bags",
        "Work gloves",
        "Disinfectant spray"
      ],
      "safety_warning": "Avoid sharp metal debris in loose bags.",
      "suggested_resolution": "Bag overflowing cardboard and clear pedestrian sidewalk."
    },
    "status": "In Progress",
    "upvotes": 12,
    "community_verifications": 8,
    "created_at": "2026-10-24T07:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-107",
    "title": "Sunken road surface & asphalt depression at busy roundabout",
    "category": "Pothole",
    "severity": "High",
    "urgency_score": 8,
    "description": "Asphalt cavity 60cm wide right at the roundabout lane entrance causing sudden braking.",
    "location": {
      "lat": 34.0045,
      "lng": -6.8482,
      "address": "Place Ibn Yassine, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Hofra s3iba f rond-point dyal Ibn Yassine, t-tonobilat kaytehro fih.",
    "community_action": {
      "action_plan": "Place reflective safety markers; apply cold-asphalt patch with hand tamper.",
      "required_tools": [
        "Cold-mix asphalt (50kg)",
        "Hand tamper",
        "Warning cones"
      ],
      "safety_warning": "Heavy traffic at roundabout; maintain traffic diversion cones.",
      "suggested_resolution": "Pothole filled and tamped flush with road surface."
    },
    "status": "Open",
    "upvotes": 18,
    "community_verifications": 12,
    "created_at": "2026-10-24T10:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-108",
    "title": "Broken paving slabs on pedestrian café strip",
    "category": "Road Hazard",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Shattered sidewalk tiles creating a severe tripping hazard for pedestrians outside cafés.",
    "location": {
      "lat": 34.0092,
      "lng": -6.8441,
      "address": "Avenue Fal Ould Oumeir, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Level sandy foundation and reset replacement stone slabs.",
      "required_tools": [
        "Masonry trowel",
        "Level",
        "Paving sand",
        "Rubber mallet"
      ],
      "safety_warning": "Watch out for shattered tile sharp edges.",
      "suggested_resolution": "Paving slabs reset and flush with walkway."
    },
    "status": "Open",
    "upvotes": 8,
    "community_verifications": 5,
    "created_at": "2026-10-24T01:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-109",
    "title": "Exposed wiring at municipal garden lamppost base",
    "category": "Lighting",
    "severity": "Critical",
    "urgency_score": 9,
    "description": "Lamppost panel detached with exposed wire cluster near children play park.",
    "location": {
      "lat": 34.0068,
      "lng": -6.8415,
      "address": "Jardin d'Essais Botaniques (Rue Michlifen), Agdal",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "URGENT: Cordon off with danger tape and insulate connectors.",
      "required_tools": [
        "Insulation tape",
        "Hazard barrier tape",
        "Insulated screwdriver"
      ],
      "safety_warning": "Keep children away from lamppost base.",
      "suggested_resolution": "Wiring insulated and protective metal hatch bolted."
    },
    "status": "Open",
    "upvotes": 23,
    "community_verifications": 17,
    "created_at": "2026-10-24T13:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-110",
    "title": "Clogged storm grate outside university science campus",
    "category": "Water & Drainage",
    "severity": "High",
    "urgency_score": 7,
    "description": "Catchment grate completely packed with autumn leaves causing sidewalk flood.",
    "location": {
      "lat": 34.0028,
      "lng": -6.8521,
      "address": "Avenue Ibn Sina, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "manual"
    },
    "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Use hook tool to clear leaf blockage and rake perimeter gutter.",
      "required_tools": [
        "Drain hook",
        "Rake",
        "Heavy debris bags"
      ],
      "safety_warning": "Road is slick; wear high-vis vest.",
      "suggested_resolution": "Grate cleared and runoff water flowing freely."
    },
    "status": "In Progress",
    "upvotes": 10,
    "community_verifications": 6,
    "created_at": "2026-10-24T06:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-111",
    "title": "Repaired pedestrian crosswalk ramp after citizen action",
    "category": "Road Hazard",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Displaced access curb re-cemented and leveled for wheelchair accessibility.",
    "location": {
      "lat": 34.0112,
      "lng": -6.8405,
      "address": "Rue Oukaïmeden, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T08:43:26.940Z",
      "note": "Ramp curb re-cemented and smoothed with quick-set mortar."
    },
    "community_action": {
      "action_plan": "Verified resolved by neighborhood accessibility volunteers.",
      "required_tools": [
        "Mortar",
        "Trowel"
      ],
      "safety_warning": "Curb is solid and accessible.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 31,
    "community_verifications": 22,
    "created_at": "2026-10-23T14:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-112",
    "title": "Discarded commercial plastic crates blocking bike lane",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Stack of broken delivery plastic crates left on bicycle corridor.",
    "location": {
      "lat": 34.0051,
      "lng": -6.8465,
      "address": "Rue Aguelmane Sidi Ali, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Collect and stack crates safely out of bike transit lane.",
      "required_tools": [
        "Work gloves"
      ],
      "safety_warning": "Watch out for cracked sharp plastic edges.",
      "suggested_resolution": "Bike lane cleared and unobstructed."
    },
    "status": "Open",
    "upvotes": 6,
    "community_verifications": 3,
    "created_at": "2026-10-24T08:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-113",
    "title": "Bent one-way street sign confusing motorists",
    "category": "Vandalism",
    "severity": "Low",
    "urgency_score": 4,
    "description": "One-way municipal traffic sign bent backwards causing wrong-way entries.",
    "location": {
      "lat": 34.0075,
      "lng": -6.849,
      "address": "Rue Dayet Aoua, Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1572945753563-804956783194?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Lever sign post back to plumb and tighten base bolts.",
      "required_tools": [
        "Socket wrench set",
        "Lever bar"
      ],
      "safety_warning": "Ensure sign is stable while torquing.",
      "suggested_resolution": "Sign aligned and facing oncoming traffic."
    },
    "status": "Open",
    "upvotes": 5,
    "community_verifications": 2,
    "created_at": "2026-10-23T21:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-114",
    "title": "Resolved streetlight repair after community electrical tape wrap",
    "category": "Lighting",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Exposed wires safely bundled and sealed inside lamppost column.",
    "location": {
      "lat": 34.0102,
      "lng": -6.843,
      "address": "Rue Patrice Lumumba cross Agdal, Rabat",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T10:43:26.940Z",
      "note": "Electrical panel sealed with weather-resistant cover."
    },
    "community_action": {
      "action_plan": "Verified resolved by local neighborhood electrician volunteer.",
      "required_tools": [
        "Insulating kit"
      ],
      "safety_warning": "Fixture is safe and insulated.",
      "suggested_resolution": "Community verified with photo proof."
    },
    "status": "Resolved",
    "upvotes": 25,
    "community_verifications": 18,
    "created_at": "2026-10-23T11:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-115",
    "title": "Water pooling from burst irrigation hose on tramway median",
    "category": "Water & Drainage",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Punctured municipal sprinkler line spraying water across tram tracks and road.",
    "location": {
      "lat": 34.0089,
      "lng": -6.836,
      "address": "Avenue de France (Tramway L1), Agdal",
      "neighborhood": "Agdal",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Turn off median valve cock and apply hose clamp.",
      "required_tools": [
        "Valve key",
        "Rubber repair clamp"
      ],
      "safety_warning": "Mind approaching tramway cars.",
      "suggested_resolution": "Irrigation leak sealed."
    },
    "status": "In Progress",
    "upvotes": 9,
    "community_verifications": 4,
    "created_at": "2026-10-24T11:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-116",
    "title": "Exposed electrical wires at streetlight base near school",
    "category": "Lighting",
    "severity": "Critical",
    "urgency_score": 10,
    "description": "Access hatch missing at waist height with live wiring connections visible. Extreme electrocution danger near school route.",
    "location": {
      "lat": 34.0152,
      "lng": -6.8329,
      "address": "Avenue Mohammed V, Quartier Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "manual"
    },
    "image_url": "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Poteau d'éclairage avec fils électriques à nu à Hassan, très dangereux pour les enfants!",
    "community_action": {
      "action_plan": "URGENT: Wrap junction with temporary insulated barrier and place caution tape immediately.",
      "required_tools": [
        "Heavy-duty electrical insulating tape",
        "Warning hazard tape",
        "Protective cover"
      ],
      "safety_warning": "CRITICAL: Do NOT touch bare copper wires under any circumstances.",
      "suggested_resolution": "Insulate live contacts and fit a lockable replacement hatch."
    },
    "status": "Open",
    "upvotes": 21,
    "community_verifications": 15,
    "created_at": "2026-10-24T13:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-117",
    "title": "Damaged stone balustrade near historic Tour Hassan esplanade",
    "category": "Road Hazard",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Cracked decorative stone barrier leaning toward tourist walkway.",
    "location": {
      "lat": 34.0225,
      "lng": -6.8228,
      "address": "Boulevard Mohamed Lyazidi (Tour Hassan), Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Place support wedge and cordon off base with heritage warning sign.",
      "required_tools": [
        "Wooden wedge",
        "Heritage barrier rope"
      ],
      "safety_warning": "Do not lean on fractured balustrade section.",
      "suggested_resolution": "Balustrade stabilized pending stone mason restoration."
    },
    "status": "Open",
    "upvotes": 15,
    "community_verifications": 8,
    "created_at": "2026-10-24T04:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-118",
    "title": "Deep road fissure along tramway crossing",
    "category": "Pothole",
    "severity": "High",
    "urgency_score": 8,
    "description": "Long asphalt fissure opening alongside tram rail track causing bike wheels to catch.",
    "location": {
      "lat": 34.0182,
      "lng": -6.831,
      "address": "Avenue Moulay Ismail, Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Fill gap with bitumen joint sealant to protect two-wheelers.",
      "required_tools": [
        "Cold asphalt joint sealant",
        "Applicator trowel"
      ],
      "safety_warning": "Beware of passing tramcars during trackside inspection.",
      "suggested_resolution": "Trackside fissure sealed flush with rail level."
    },
    "status": "In Progress",
    "upvotes": 17,
    "community_verifications": 10,
    "created_at": "2026-10-24T08:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-119",
    "title": "Trash overflow beside administrative building bins",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Paper archive waste and domestic refuse overflowing past public bins.",
    "location": {
      "lat": 34.0165,
      "lng": -6.8285,
      "address": "Rue Al Mansour Addahbi, Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Bag excess paper debris and sweep sidewalk.",
      "required_tools": [
        "Large refuse bags",
        "Broom"
      ],
      "safety_warning": "Wear gloves while collecting paper waste.",
      "suggested_resolution": "Sidewalk swept clean of loose rubbish."
    },
    "status": "Open",
    "upvotes": 8,
    "community_verifications": 4,
    "created_at": "2026-10-24T00:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-120",
    "title": "Sewage manhole cover dislodged after heavy vehicle pass",
    "category": "Water & Drainage",
    "severity": "Critical",
    "urgency_score": 9,
    "description": "Heavy cast-iron manhole displaced by 15cm leaving gaping hole in traffic lane.",
    "location": {
      "lat": 34.0201,
      "lng": -6.8265,
      "address": "Rue Patrice Lumumba, Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "CRITICAL: Place safety cones around manhole and lever cover back into groove.",
      "required_tools": [
        "Manhole lifting hooks (x2)",
        "Warning cones (x3)"
      ],
      "safety_warning": "Risk of vehicle wheel drop; divert cars immediately.",
      "suggested_resolution": "Manhole seated firmly in frame and flush."
    },
    "status": "Open",
    "upvotes": 27,
    "community_verifications": 19,
    "created_at": "2026-10-24T14:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-121",
    "title": "Resolved streetlight restoration on historic Avenue Mohammed V",
    "category": "Lighting",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Ornate street lantern bulb replaced and wiring junction sealed.",
    "location": {
      "lat": 34.0175,
      "lng": -6.8335,
      "address": "Avenue Mohammed V (near Bank Al-Maghrib), Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T07:43:26.940Z",
      "note": "LED bulb installed and lantern fixture safely illuminated."
    },
    "community_action": {
      "action_plan": "Verified resolved by Hassan commercial association volunteers.",
      "required_tools": [
        "Bulb",
        "Ladder"
      ],
      "safety_warning": "Lantern is operational.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 38,
    "community_verifications": 26,
    "created_at": "2026-10-23T03:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-122",
    "title": "Asphalt rutting causing water ponding along bus lane",
    "category": "Pothole",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Depressed asphalt wheel ruts in bus stop bay causing standing water.",
    "location": {
      "lat": 34.0195,
      "lng": -6.8302,
      "address": "Avenue Moulay Youssef, Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Level depression with cold asphalt layer and tamp.",
      "required_tools": [
        "Cold asphalt (25kg)",
        "Hand tamper"
      ],
      "safety_warning": "Schedule work between bus transit arrivals.",
      "suggested_resolution": "Bus bay depression leveled."
    },
    "status": "In Progress",
    "upvotes": 11,
    "community_verifications": 7,
    "created_at": "2026-10-24T05:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-123",
    "title": "Defaced historical direction plaque cleaned by volunteers",
    "category": "Vandalism",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Spray paint tagging removed from bronze Chellah directional sign.",
    "location": {
      "lat": 34.0142,
      "lng": -6.829,
      "address": "Carrefour Bab Chellah, Hassan, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1572945753563-804956783194?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T12:43:26.940Z",
      "note": "Graffiti solvent applied; sign polished clean."
    },
    "community_action": {
      "action_plan": "Verified resolved by youth civic preservation group.",
      "required_tools": [
        "Eco solvent",
        "Cleaning cloths"
      ],
      "safety_warning": "Sign is clean and legible.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 22,
    "community_verifications": 15,
    "created_at": "2026-10-23T17:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-124",
    "title": "Broken stormwater drain grate near Bab Chellah crossing",
    "category": "Water & Drainage",
    "severity": "High",
    "urgency_score": 8,
    "description": "Broken iron bar on drain grate allowing bicycle wheels to fall through.",
    "location": {
      "lat": 34.0135,
      "lng": -6.8315,
      "address": "Boulevard Bouregreg cross Chellah, Rabat",
      "neighborhood": "Hassan",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Place warning cones and fit a replacement steel grate section.",
      "required_tools": [
        "Replacement drain bar",
        "Welding clamp",
        "Cones"
      ],
      "safety_warning": "High risk for cyclists entering traffic lane.",
      "suggested_resolution": "Grate bars repaired and secured."
    },
    "status": "Open",
    "upvotes": 16,
    "community_verifications": 11,
    "created_at": "2026-10-24T11:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-125",
    "title": "Dislodged ancient cobblestones in bustling souk lane",
    "category": "Road Hazard",
    "severity": "High",
    "urgency_score": 7,
    "description": "Loose paving stones protruding 5cm causing elderly shoppers and tourists to trip.",
    "location": {
      "lat": 34.0255,
      "lng": -6.8368,
      "address": "Rue Souika, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Hjar dyal zniqa f souk Souika meqloubin, n-nas kayt3atro fihom.",
    "community_action": {
      "action_plan": "Shopkeeper volunteer effort: re-level sand bed and hammer stones flush.",
      "required_tools": [
        "Cobble mallet",
        "River sand bag",
        "Chisel"
      ],
      "safety_warning": "High foot traffic; work during early morning opening hours.",
      "suggested_resolution": "Cobblestones tamped level with alley surface."
    },
    "status": "Open",
    "upvotes": 19,
    "community_verifications": 13,
    "created_at": "2026-10-24T10:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-126",
    "title": "Blocked stormwater drain cleared by local volunteers",
    "category": "Water & Drainage",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Sediment and plastic obstruction cleared from storm drain grates by neighborhood volunteers ahead of rain.",
    "location": {
      "lat": 34.0205,
      "lng": -6.8415,
      "address": "Rue des Consuls, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T13:43:26.940Z",
      "note": "Storm drain cleared and fully restored by Médina neighborhood youth volunteers."
    },
    "community_action": {
      "action_plan": "Verified resolved by neighborhood group after cleanout.",
      "required_tools": [
        "Drain hook",
        "Shovel",
        "Compost bags"
      ],
      "safety_warning": "Drain is free and clear for winter runoff.",
      "suggested_resolution": "Community verified as fully restored."
    },
    "status": "Resolved",
    "upvotes": 34,
    "community_verifications": 28,
    "created_at": "2026-10-23T19:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-127",
    "title": "Overflowing commercial waste outside artisan leather souk",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Leather off-cuts and cardboard packaging piled outside communal trash skip.",
    "location": {
      "lat": 34.0281,
      "lng": -6.8392,
      "address": "Souk Sebbat, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Artisan cooperative cleanup drive to bag scraps and clear alley passage.",
      "required_tools": [
        "100L heavy bags",
        "Brooms",
        "Gloves"
      ],
      "safety_warning": "Watch out for cutting blades in leather scrap bags.",
      "suggested_resolution": "Alleyway cleared and waste placed inside designated skip."
    },
    "status": "In Progress",
    "upvotes": 14,
    "community_verifications": 8,
    "created_at": "2026-10-24T07:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-128",
    "title": "Loose wooden support beam under heritage covered alley",
    "category": "Road Hazard",
    "severity": "Critical",
    "urgency_score": 9,
    "description": "Overhead wooden arch lintel loose and shifting over crowded pedestrian walkway.",
    "location": {
      "lat": 34.0268,
      "lng": -6.835,
      "address": "Derb El Guezzar, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "CRITICAL: Place temporary timber shore post until heritage carpenters restore joint.",
      "required_tools": [
        "Acro prop support",
        "Timber wedge",
        "Caution tape"
      ],
      "safety_warning": "Risk of falling timber; divert foot traffic through adjacent derb.",
      "suggested_resolution": "Acro prop secured and beam braced."
    },
    "status": "Open",
    "upvotes": 29,
    "community_verifications": 21,
    "created_at": "2026-10-24T13:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-129",
    "title": "Water leak from historic stone wall drinking fountain",
    "category": "Water & Drainage",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Brass tap defective causing continuous freshwater runoff over stairs.",
    "location": {
      "lat": 34.0315,
      "lng": -6.8362,
      "address": "Place Bab El Alou, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Replace rubber washer inside brass fountain tap.",
      "required_tools": [
        "Pipe wrench",
        "Rubber tap washer assortment"
      ],
      "safety_warning": "Stone steps are slippery from moss.",
      "suggested_resolution": "Fountain tap shutoff valve tight and drip-free."
    },
    "status": "In Progress",
    "upvotes": 12,
    "community_verifications": 7,
    "created_at": "2026-10-24T02:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-130",
    "title": "Exposed wall electrical junction box near spice market",
    "category": "Lighting",
    "severity": "High",
    "urgency_score": 8,
    "description": "Open electrical distribution box at head height in narrow alley with cloth awnings.",
    "location": {
      "lat": 34.0272,
      "lng": -6.8379,
      "address": "Souk El Ghezel, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Fit plastic weatherproof junction cover and tape exposed connectors.",
      "required_tools": [
        "Plastic junction cover",
        "Insulating tape",
        "Screws"
      ],
      "safety_warning": "Do not touch connectors with wet hands.",
      "suggested_resolution": "Box sealed securely against rain."
    },
    "status": "Open",
    "upvotes": 18,
    "community_verifications": 12,
    "created_at": "2026-10-24T09:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-131",
    "title": "Deep road cavity at Bab El Had gateway car entrance",
    "category": "Pothole",
    "severity": "High",
    "urgency_score": 8,
    "description": "Pothole 50cm wide where asphalt meets ancient ramparts gateway.",
    "location": {
      "lat": 34.0229,
      "lng": -6.8425,
      "address": "Place Bab El Had, Médina, Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Fill cavity with cold-mix asphalt and compact flush.",
      "required_tools": [
        "Cold asphalt (50kg)",
        "Hand tamper",
        "Warning cones"
      ],
      "safety_warning": "Intense taxi and pedestrian traffic around Bab El Had.",
      "suggested_resolution": "Gateway entry asphalt restored smooth."
    },
    "status": "Open",
    "upvotes": 23,
    "community_verifications": 14,
    "created_at": "2026-10-24T11:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-132",
    "title": "Resolved Kasbah des Oudayas stone stair repair",
    "category": "Road Hazard",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Chipped sandstone step rebuilt with lime mortar by artisan volunteer.",
    "location": {
      "lat": 34.0328,
      "lng": -6.8345,
      "address": "Rue Jamaa (Kasbah des Oudayas), Rabat",
      "neighborhood": "Médina",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T06:43:26.940Z",
      "note": "Step nose rebuilt with authentic lime mortar and dried firm."
    },
    "community_action": {
      "action_plan": "Verified resolved by Kasbah residents association.",
      "required_tools": [
        "Lime mortar"
      ],
      "safety_warning": "Stair tread is solid and level.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 42,
    "community_verifications": 31,
    "created_at": "2026-10-22T23:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-133",
    "title": "High-speed avenue pothole causing severe wheel alignment issues",
    "category": "Pothole",
    "severity": "Critical",
    "urgency_score": 9,
    "description": "Abrupt 10cm deep asphalt hole in center lane of 60km/h avenue.",
    "location": {
      "lat": 33.9685,
      "lng": -6.8725,
      "address": "Avenue Annakhil, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "URGENT: Place warning beacon; fill immediately with fast-cure asphalt.",
      "required_tools": [
        "Cold asphalt (75kg)",
        "Heavy hand tamper",
        "Reflective cones"
      ],
      "safety_warning": "Fast vehicle approach speeds; place cones 50m upstream.",
      "suggested_resolution": "Pothole compacted flush with avenue tarmac."
    },
    "status": "Open",
    "upvotes": 26,
    "community_verifications": 18,
    "created_at": "2026-10-24T12:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-134",
    "title": "Uncollected garden pruning waste on residential sidewalk",
    "category": "Sanitation",
    "severity": "Low",
    "urgency_score": 4,
    "description": "Large pile of palm fronds and hedge trimmings blocking stroller access.",
    "location": {
      "lat": 33.9642,
      "lng": -6.8789,
      "address": "Avenue Al Melia, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Neighborhood green committee grouping branches for green waste pickup.",
      "required_tools": [
        "Garden shears",
        "Baling twine",
        "Gloves"
      ],
      "safety_warning": "Mind sharp palm thorns.",
      "suggested_resolution": "Sidewalk cleared and vegetation bundled."
    },
    "status": "In Progress",
    "upvotes": 7,
    "community_verifications": 4,
    "created_at": "2026-10-24T04:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-135",
    "title": "Dark pedestrian crossing at Mahaj Riad business promenade",
    "category": "Lighting",
    "severity": "High",
    "urgency_score": 8,
    "description": "Twin pedestrian crosswalk LED fixtures burned out making crossing unsafe at night.",
    "location": {
      "lat": 33.9712,
      "lng": -6.8698,
      "address": "Mahaj Riad (Avenue Al Arar), Hay Riad",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Report ballast failure and install temporary solar warning markers.",
      "required_tools": [
        "Solar road beacons (x4)"
      ],
      "safety_warning": "High pedestrian evening volume from corporate offices.",
      "suggested_resolution": "Crosswalk floodlights replaced and illuminated."
    },
    "status": "Open",
    "upvotes": 19,
    "community_verifications": 13,
    "created_at": "2026-10-24T10:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-136",
    "title": "Displaced concrete curb barrier at parking entrance",
    "category": "Road Hazard",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Heavy curb separator knocked into lane by delivery truck.",
    "location": {
      "lat": 33.966,
      "lng": -6.8745,
      "address": "Avenue Al Atlas, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Lever curb block back onto alignment line and mortar base.",
      "required_tools": [
        "Crowbar",
        "Pre-mix mortar",
        "Rubber mallet"
      ],
      "safety_warning": "Heavy block (approx 45kg); lift with two people.",
      "suggested_resolution": "Curb aligned and anchored."
    },
    "status": "Open",
    "upvotes": 10,
    "community_verifications": 6,
    "created_at": "2026-10-24T06:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-137",
    "title": "Resolved storm drainage repair after volunteer grate clearance",
    "category": "Water & Drainage",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Subterranean drain pipe flushed and surface leaves removed.",
    "location": {
      "lat": 33.9698,
      "lng": -6.8715,
      "address": "Avenue Ennakhil 2, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T09:43:26.940Z",
      "note": "Water pump hose flushed drainage pipe clean."
    },
    "community_action": {
      "action_plan": "Verified resolved by Hay Riad property owners committee.",
      "required_tools": [
        "Pressure hose"
      ],
      "safety_warning": "Drainage operating at full flow.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 35,
    "community_verifications": 24,
    "created_at": "2026-10-23T07:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-138",
    "title": "Commercial packaging refuse behind bank agency",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 5,
    "description": "Plastic wrap and shredded cardboard stacked beside transformer station.",
    "location": {
      "lat": 33.9628,
      "lng": -6.881,
      "address": "Rue Al Borj, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Contact property manager and bag loose packaging.",
      "required_tools": [
        "Heavy bags",
        "Gloves"
      ],
      "safety_warning": "Keep clearance from high voltage transformer box.",
      "suggested_resolution": "Refuse removed completely."
    },
    "status": "Open",
    "upvotes": 6,
    "community_verifications": 3,
    "created_at": "2026-10-24T01:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-139",
    "title": "Speed bump paint faded causing vehicle bottoming out",
    "category": "Road Hazard",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Asphalt speed reducer invisible at night due to worn reflective paint.",
    "location": {
      "lat": 33.9672,
      "lng": -6.8762,
      "address": "Avenue Al Haouz, Hay Riad, Rabat",
      "neighborhood": "Hay Riad",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Repaint yellow/white reflective stripes across speed bump.",
      "required_tools": [
        "Road marking paint (yellow)",
        "Roller",
        "Stencils"
      ],
      "safety_warning": "Work with traffic spotter during daytime.",
      "suggested_resolution": "Reflective stripes repainted and visible."
    },
    "status": "In Progress",
    "upvotes": 14,
    "community_verifications": 9,
    "created_at": "2026-10-24T07:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-140",
    "title": "Severe coastal road pothole on oceanfront corniche",
    "category": "Pothole",
    "severity": "High",
    "urgency_score": 8,
    "description": "Deep saltwater-eroded pothole on coastal drive lane near lighthouse.",
    "location": {
      "lat": 34.0285,
      "lng": -6.852,
      "address": "Boulevard Al Marsa (Corniche de l'Océan), Rabat",
      "neighborhood": "Rabat Center",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "voice_transcript": "Hofra kbira f triq l-marsa b-sbb l-bher, dharat s3iba.",
    "community_action": {
      "action_plan": "Fill hole with marine-grade asphalt patch and tamp.",
      "required_tools": [
        "Cold asphalt",
        "Hand tamper",
        "Warning cones"
      ],
      "safety_warning": "Salt spray can make surrounding asphalt slick.",
      "suggested_resolution": "Pothole filled and sealed against sea spray."
    },
    "status": "Open",
    "upvotes": 24,
    "community_verifications": 16,
    "created_at": "2026-10-24T11:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-141",
    "title": "Overflowing public bins on busy coastal promenade",
    "category": "Sanitation",
    "severity": "Medium",
    "urgency_score": 6,
    "description": "Beach promenade bins overflowing with plastic bottles and food packaging.",
    "location": {
      "lat": 34.021,
      "lng": -6.858,
      "address": "Avenue Al Kifah, Yacoub El Mansour, Rabat",
      "neighborhood": "Rabat Center",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    "community_action": {
      "action_plan": "Youth coastal volunteer squad cleanup drive along promenade.",
      "required_tools": [
        "Heavy bags",
        "Grabbers",
        "Gloves"
      ],
      "safety_warning": "Wear gloves to pick up ocean shoreline bottles.",
      "suggested_resolution": "Promenade bins emptied and area swept."
    },
    "status": "In Progress",
    "upvotes": 18,
    "community_verifications": 11,
    "created_at": "2026-10-24T08:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  },
  {
    "id": "RBT-142",
    "title": "Resolved storm drainage restoration on Avenue Mohamed VI",
    "category": "Water & Drainage",
    "severity": "Low",
    "urgency_score": 2,
    "description": "Roadside stormwater gutter cleared of sand buildup by local landscaping crew.",
    "location": {
      "lat": 33.9785,
      "lng": -6.828,
      "address": "Avenue Mohamed VI (Souissi), Rabat",
      "neighborhood": "Rabat Center",
      "source": "gps"
    },
    "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "resolution_proof": {
      "image_url": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
      "verified_at": "2026-10-24T03:43:26.940Z",
      "note": "Gutter vacuumed of sand sediment and drainage grates pressure-washed."
    },
    "community_action": {
      "action_plan": "Verified resolved by Souissi neighborhood association.",
      "required_tools": [
        "Vacuum truck"
      ],
      "safety_warning": "Avenue gutters are clear.",
      "suggested_resolution": "Confirmed resolved with photo proof."
    },
    "status": "Resolved",
    "upvotes": 49,
    "community_verifications": 37,
    "created_at": "2026-10-22T15:43:26.940Z",
    "model_used": "Google Gemma 4 (26B MoE via Gemini API)",
    "skills_executed": [
      "visual-hazard-inspection",
      "community-action-synthesis"
    ],
    "privacy_vetted": true
  }
];
