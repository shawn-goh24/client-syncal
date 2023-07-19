import chroma from "chroma-js";

export const colorOptions = [
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

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.value);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.value
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.value,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.value
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.value) }),
};

export const rsvps = ["Yes", "No", "Maybe"];
