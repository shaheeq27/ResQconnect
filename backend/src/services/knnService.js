/**
 * Calculates the Great Circle distance (in kilometers) between two GPS points
 * using the Haversine formula.
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Return rounded to 2 decimal places
}

/**
 * Finds the K nearest neighbors among a list of candidates relative to a target location.
 * @param {Object} targetLocation - { latitude, longitude }
 * @param {Array} candidateProviders - Array of providers with { id, latitude, longitude, ... }
 * @param {number} k - Number of nearest neighbors to return (default 1)
 * @returns {Array} Sorted candidate providers with attached `distance_km` property
 */
function findNearestNeighbors(targetLocation, candidateProviders, k = 1) {
  if (!targetLocation || candidateProviders.length === 0) {
    return [];
  }

  const targetLat = parseFloat(targetLocation.latitude);
  const targetLon = parseFloat(targetLocation.longitude);

  const rankedCandidates = candidateProviders
    .map((provider) => {
      const pLat = parseFloat(provider.latitude);
      const pLon = parseFloat(provider.longitude);

      if (isNaN(pLat) || isNaN(pLon)) {
        return null;
      }

      const dist = calculateHaversineDistance(targetLat, targetLon, pLat, pLon);
      return {
        ...provider,
        distance_km: dist,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance_km - b.distance_km);

  return rankedCandidates.slice(0, k);
}

module.exports = {
  calculateHaversineDistance,
  findNearestNeighbors,
};
