import { calculateDistanceMeters, findNearbyDuplicates } from '../lib/geoUtils';
import fs from 'fs';
import path from 'path';
import { CivicReport } from '../types';

console.log('🧪 RUNNING CIVICPULSE RABAT COMMUNITY VERIFICATION...\n');

// 1. Verify Agent Skill Open Standard Directory
console.log('--- Test 1: Agent Skill Open Standard Validation ---');
const skillsDir = path.join(process.cwd(), 'skills');
if (!fs.existsSync(skillsDir)) {
  console.error('❌ Failed: skills directory missing');
  process.exit(1);
}

const requiredSkills = [
  'visual-hazard-inspection',
  'community-action-synthesis',
  'duplicate-detector'
];

for (const skill of requiredSkills) {
  const skillFile = path.join(skillsDir, skill, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error(`❌ Failed: Skill ${skill}/SKILL.md not found`);
    process.exit(1);
  }
  const content = fs.readFileSync(skillFile, 'utf-8');
  if (!content.includes('---') || !content.includes('name:')) {
    console.error(`❌ Failed: Skill ${skill}/SKILL.md missing valid YAML frontmatter`);
    process.exit(1);
  }
  console.log(`✅ Verified Skill: ${skill}/SKILL.md`);
}

// 2. Verify GeoUtils Haversine Distance & Proximity Duplicates
console.log('\n--- Test 2: Haversine Distance & Proximity Deduplication ---');
const technopolisLat = 33.9876;
const technopolisLng = -6.7268;

// Test point ~22 meters away
const nearbyLat = 33.9878;
const nearbyLng = -6.7268;
const distance = calculateDistanceMeters(technopolisLat, technopolisLng, nearbyLat, nearbyLng);
console.log(`Calculated distance between points: ${distance.toFixed(1)} meters`);

if (distance > 10 && distance < 50) {
  console.log('✅ Distance calculation accurate within expected range.');
} else {
  console.error(`❌ Unexpected distance: ${distance}`);
  process.exit(1);
}

const mockReport: CivicReport = {
  id: 'RBT-TEST',
  title: 'Test Pothole in Rabat',
  category: 'Pothole',
  severity: 'High',
  urgency_score: 8,
  description: 'Test',
  location: { lat: technopolisLat, lng: technopolisLng, address: 'Technopolis, Rabat', neighborhood: 'Technopolis (UM6P)', source: 'gps' },
  image_url: '',
  community_action: { action_plan: 'Volunteer patch', required_tools: ['Asphalt'], safety_warning: 'Caution', suggested_resolution: 'Fill' },
  status: 'Open',
  upvotes: 1,
  community_verifications: 1,
  created_at: new Date().toISOString(),
  model_used: 'Google Gemma 4',
  skills_executed: [],
  privacy_vetted: true,
};

const duplicateMatch = findNearbyDuplicates(nearbyLat, nearbyLng, [mockReport], 60);
if (duplicateMatch && duplicateMatch.report.id === 'RBT-TEST') {
  console.log(`✅ Duplicate detection successfully identified nearby report (${duplicateMatch.distance}m away).`);
} else {
  console.error('❌ Duplicate detection failed to match nearby report.');
  process.exit(1);
}

// 3. Verify Mock Data Integrity
console.log('\n--- Test 3: Seed Data & Rabat Coordinates Verification ---');
const mockDataFile = path.join(process.cwd(), 'lib', 'mockData.ts');
if (fs.existsSync(mockDataFile)) {
  const content = fs.readFileSync(mockDataFile, 'utf-8');
  if (content.includes('RBT-101') && content.includes('Agdal') && content.includes('Gemma 4')) {
    console.log('✅ Rabat community seed data verified.');
  } else {
    console.error('❌ mockData.ts missing expected seed fields.');
    process.exit(1);
  }
}

console.log('\n🎉 ALL RABAT COMMUNITY TESTS PASSED SUCCESSFULLY!');
