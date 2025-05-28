function testXAmzDate(output) {
  const received = new Date(
    output.slice(0, 4) + '-' +
    output.slice(4, 6) + '-' +
    output.slice(6, 8) + 'T' +
    output.slice(9, 11) + ':' +
    output.slice(11, 13) + ':' +
    output.slice(13, 15) + 'Z'
  );
  const now = new Date();
  const diff = Math.abs(now - received);
  console.log("Diff (ms):", diff);
  if (diff < 1000) {
    console.log("✅ Timestamp is within 1 second");
  } else {
    console.error("❌ Timestamp is out of sync");
    process.exit(1);
  }
}

module.exports = { testXAmzDate };