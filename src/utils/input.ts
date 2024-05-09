/**
 *  Format time string to HH:mm:ss
 */
export const formatTime = (time: string) => {
  return time
    .replace(/[^\d:：]/g, "") // only keep number and colon
    .replace(/：/g, ":") // turn Chinese colon to English colon
    .replace(/::+/g, ":") // remove multiple colons
    .replace(/^([^:]*:[^:]*:[^:]*):/, "$1")
    .replace(/(?<=:)(\d+)/g, (_, $1) => {
      const num = parseInt($1);
      return (num > 59 ? 59 : num).toString().padStart(2, "0"); // Limitation of ceilings 59
    });
};
