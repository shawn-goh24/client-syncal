import { Checkbox, Flex, FormLabel } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

export default function CustomFormCheckbox({ label, text, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Flex alignItems="center">
        <Checkbox
          {...field}
          {...props}
          className={meta.touched && meta.error ? "text-red-300" : ""}
        />
        <span>{text}</span>
      </Flex>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </>
  );
}
