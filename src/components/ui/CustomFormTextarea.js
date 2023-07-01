import { FormLabel, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

export default function CustomFormTextarea({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Textarea
        {...field}
        {...props}
        className={meta.touched && meta.error ? "text-red-300" : ""}
      />
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </>
  );
}
