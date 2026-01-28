export function getWeatherBg(condition?: string) {
  const c = (condition || "").toLowerCase();

  if (c.includes("thunder") || c.includes("storm"))
    return require("../../assets/weather/storm.jpg");
  if (c.includes("snow")) return require("../../assets/weather/snow.jpg");
  if (c.includes("rain") || c.includes("drizzle"))
    return require("../../assets/weather/rain.webp");
  if (c.includes("fog") || c.includes("mist") || c.includes("haze"))
    return require("../../assets/weather/fog.webp");
  if (c.includes("clear") || c.includes("sun"))
    return require("../../assets/weather/clear.jpg");
  if (c.includes("cloud")) return require("../../assets/weather/cloudy.jpg");

  return null;
}
