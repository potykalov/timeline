export default function parseCoordinates(value) {
  const regex = /^\[?\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\]?$/;

  const match = value.match(regex);

  if (!match) {
    throw new Error("Некорректный формат координат");
  }

  const latitude = Number(match[1]);
  const longitude = Number(match[3]);

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Координаты находятся вне допустимого диапазона");
  }

  return { latitude, longitude };
}
