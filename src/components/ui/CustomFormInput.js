import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

export default function CustomFormInput({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        className={meta.touched && meta.error ? "text-red-300" : ""}
      />
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </>
  );
}
