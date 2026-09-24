const { calculateHaversineDistance, findNearestNeighbors } = require("../src/services/knnService");

console.log("--- Testing KNN Nearest Neighbor Distance Algorithm ---");

const targetLocation = { latitude: 12.9716, longitude: 77.5946 }; // Bangalore Center

const candidates = [
  { id: 1, name: "Provider Far Away", latitude: 13.0827, longitude: 80.2707 }, // Chennai (~290 km)
  { id: 2, name: "Provider Nearby 1", latitude: 12.9750, longitude: 77.5990 }, // ~0.6 km away
  { id: 3, name: "Provider Nearby 2", latitude: 12.9600, longitude: 77.5800 }, // ~2.0 km away
];

const distance1 = calculateHaversineDistance(12.9716, 77.5946, 12.9750, 77.5990);
console.log(`Distance to Provider Nearby 1: ${distance1} km`);

const nearest = findNearestNeighbors(targetLocation, candidates, 1);
console.log("Winning Nearest Provider:", nearest[0]);

if (nearest[0].id === 2 && nearest[0].distance_km < 1.0) {
  console.log("✅ SUCCESS: KNN Algorithm correctly selected nearest provider!");
} else {
  console.error("❌ FAILED: Incorrect provider selected.");
  process.exit(1);
}
