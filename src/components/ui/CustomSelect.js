import React from "react";
import chroma from "chroma-js";

import { colorOptions } from "@/contants";
import Select from "react-select";
import { useField } from "formik";
import { FormLabel } from "@chakra-ui/react";

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

const colourStyles = {
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

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  ...props
}) {
  const [field, meta] = useField(props);

  const defaultValue = (options, value) =>
    options
      ? options.find((option) => {
          return option.value === value;
        })
      : "";

  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Select
        {...field}
        {...props}
        value={defaultValue(options, value)}
        onChange={(value) => onChange(value)}
        options={colorOptions}
        styles={colourStyles}
      />
    </>
  );
}
