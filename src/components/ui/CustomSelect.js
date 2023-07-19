import React from "react";
import { colorOptions } from "@/constants";
import Select from "react-select";
import { useField } from "formik";
import { FormLabel } from "@chakra-ui/react";
import { colourStyles } from "@/constants";

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
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </>
  );
}
