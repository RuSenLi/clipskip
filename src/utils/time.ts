/**
 * Parse time string to object
 */
export function parseTime(time: string) {
  if (!time) {
    return null;
  }
  const [second, minute, hour] = time.split(":").reverse();
  return { second, minute, hour };
}