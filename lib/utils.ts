export function formatDateAR(date: Date | string) {
  return new Date(date).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
}