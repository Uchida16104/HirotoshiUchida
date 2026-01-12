const logAccess = (data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ACCESS: ${data.ip} | ${data.country} - ${data.city} | ${data.action} | ${data.section}`);
};

const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`, error?.message || error);
};

module.exports = {
  logAccess,
  logError
};
