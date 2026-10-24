import { POST } from '../app/api/analyze-issue/route';
import { NextRequest } from 'next/server';

async function testApi() {
  console.log('Testing /api/analyze-issue route with Rabat Darija context...');

  const mockPayload = {
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...',
    voice_transcript: 'Kayna wahed l-hofra kbira hna f triq qdam la gare Agdal f Rabat',
    location: {
      lat: 34.0081,
      lng: -6.8378,
      address: 'Avenue de France, Agdal, Rabat',
    },
  };

  const req = new NextRequest('http://localhost:3000/api/analyze-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockPayload),
  });

  const response = await POST(req);
  const data = await response.json();

  console.log('\n--- API Output Received ---');
  console.log('Status:', response.status);
  console.log('Title:', data.title);
  console.log('Category:', data.category);
  console.log('Severity:', data.severity);
  console.log('Urgency Score:', data.urgency_score);
  console.log('Action Plan:', data.community_action?.action_plan);
  console.log('Required Tools:', data.community_action?.required_tools);
  console.log('Model Used:', data.model_used);
  console.log('Skills Executed:', data.skills_executed);

  if (data.title && data.category === 'Pothole' && data.community_action) {
    console.log('\n✅ RABAT COMMUNITY AI TRIAGE TEST PASSED!');
  } else {
    console.error('\n❌ Unexpected API output:', data);
    process.exit(1);
  }
}

testApi().catch((err) => {
  console.error('API Test Error:', err);
  process.exit(1);
});
