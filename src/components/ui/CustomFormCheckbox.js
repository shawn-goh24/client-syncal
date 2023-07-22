import { Checkbox, Flex, FormLabel } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

export default function CustomFormCheckbox({ label, text, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Flex alignItems="center" className="mb-4">
        <Checkbox
          {...field}
          {...props}
          className={meta.touched && meta.error ? "text-red-300" : ""}
        />
        <span className="ml-2">{text}</span>
      </Flex>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </>
  );
}
