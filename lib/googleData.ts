function getRTTApiUrl(): string {
  if (process.env.RTT_INTERNAL_API_URL) {
    return process.env.RTT_INTERNAL_API_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/rtt`;
  }

  return "/api/rtt";
}