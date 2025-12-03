/**
 * Returns the current time formatted as an integer MMDDHHmm.
 * Example: Nov 22, 22:13 -> 11222213
 */
export const getMagicTimeNumber = (): number => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');

  const timeString = `${month}${day}${hour}${minute}`;
  return parseInt(timeString, 10);
};