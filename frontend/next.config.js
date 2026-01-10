module.exports = {
  reactStrictMode: true,
  experimental: { appDir: true },
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "Cache-Control", value: "s-maxage=60, stale-while-revalidate=300" }]
      }
    ]
  }
}
