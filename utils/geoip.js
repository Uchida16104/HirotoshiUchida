const geoip = require('geoip-lite');

const getGeoInfo = (ip) => {
  if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      latitude: null,
      longitude: null,
      timezone: 'Unknown'
    };
  }
  
  const geo = geoip.lookup(ip);
  
  if (!geo) {
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      latitude: null,
      longitude: null,
      timezone: 'Unknown'
    };
  }
  
  return {
    country: geo.country || 'Unknown',
    city: geo.city || 'Unknown',
    region: geo.region || 'Unknown',
    latitude: geo.ll?.[0] || null,
    longitude: geo.ll?.[1] || null,
    timezone: geo.timezone || 'Unknown'
  };
};

module.exports = {
  getGeoInfo
};
