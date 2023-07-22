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
        isInvalid={meta.touched && meta.error ? true : false}
        errorBorderColor={meta.touched && meta.error ? "crimson" : ""}
      />
      {meta.touched && meta.error && (
        <div className="text-red-600">{meta.error}</div>
      )}
    </>
  );
}
