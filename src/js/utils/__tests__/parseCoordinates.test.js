import parseCoordinates from "../parseCoordinates.js";

describe("parseCoordinates", () => {
  test("координаты с пробелом", () => {
    expect(parseCoordinates("51.50851, -0.12572")).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("координаты без пробела", () => {
    expect(parseCoordinates("51.50851,-0.12572")).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("координаты в квадратных скобках", () => {
    expect(parseCoordinates("[51.50851, -0.12572]")).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test("ошибка при неправильном формате", () => {
    expect(() => parseCoordinates("51.50851")).toThrow();
  });

  test("ошибка при выходе за допустимый диапазон", () => {
    expect(() => parseCoordinates("100, 200")).toThrow();
  });
});
