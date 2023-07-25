const { describe } = require("mocha");
const { expect, assert } = require("chai");
const { formatHhMm, defaultColorValue } = require("../src/utils/utils");
const moment = require("moment");

const colorOptions = [
  { label: "Ocean", value: "#00B8D9" },
  { label: "Blue", value: "#0052CC" },
  { label: "Purple", value: "#5243AA" },
  { label: "Red", value: "#FF5630" },
  { label: "Orange", value: "#FF8B00" },
  { label: "Yellow", value: "#FFC400" },
  { label: "Green", value: "#36B37E" },
  { label: "Forest", value: "#00875A" },
  { label: "Slate", value: "#253858" },
  { label: "Silver", value: "#666666" },
];

describe("Utils", () => {
  describe("Time formatting to hh:mm function", () => {
    it("Get time from js date ", () => {
      const result = formatHhMm(new Date("12/12/12"));
      expect(result).to.equal("0:00");
    });

    it("Get time from moment (error)", () => {
      const result = formatHhMm(moment());
      assert(result);
    });
  });

  describe("Color in color options", () => {
    it("Get Ocean #00B8D9", () => {
      const result = defaultColorValue(colorOptions, "#00B8D9");
      expect(result).to.eql({ label: "Ocean", value: "#00B8D9" });
    });
    it("Get Red #FF5630", () => {
      const result = defaultColorValue(colorOptions, "#FF5630");
      expect(result).to.eql({ label: "Red", value: "#FF5630" });
    });

    it("Get color not inside the options", () => {
      const result = defaultColorValue(colorOptions, "#FF5630");
      assert(result);
    });
  });
});
