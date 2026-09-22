async function main() {
  const baseUrl = process.env.API_URL || "http://localhost:5000/api";
  const response = await fetch(`${baseUrl}/health`);
  if (!response.ok)
    throw new Error(`Health check failed with HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success || data.database !== "PostgreSQL connected") {
    throw new Error(`Unexpected health response: ${JSON.stringify(data)}`);
  }
  console.log(`HelpBridge API smoke test passed: ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
