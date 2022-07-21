const calculateResult = require("./calculateResult");

describe("calculateResult", () => {
  test("returns same number if no second operand", () => {
    const input = "-.2";
    expect(calculateResult(input)).toBe(+"-0.2");
  });
  test("does operations with two numbers", () => {
    const input = "2+2";
    expect(calculateResult(input)).toBe(+"4");
  });
  test("does operations with two decimal numbers", () => {
    const input = ".2+0.2";
    expect(calculateResult(input)).toBe(+"0.4");
  });
  test("does operations with two decimal and negative numbers", () => {
    const input = "-.2+-0.2";
    expect(calculateResult(input)).toBe(+"-0.4");
  });
  test("does operations with two decimal and negative numbers in the scientific notation", () => {
    const input = "-.2e1+-2.0e-1";
    expect(calculateResult(input)).toBe(+"-2.2");
  });
  test("throws an error when dividing by zero", () => {
    const input = "2/0";
    expect(calculateResult(input)).toBe("Math ERROR");
  });
  test("throws an error when inserting a third operand", () => {
    const input = "2+2+2";
    expect(calculateResult(input)).toBe("Syntax ERROR");
  });
  test("throws an error when the syntax is wrong", () => {
    const input = "2++";
    expect(calculateResult(input)).toBe("Syntax ERROR");
  });
});
