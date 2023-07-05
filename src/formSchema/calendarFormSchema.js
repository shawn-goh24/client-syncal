import * as yup from "yup";

export const eventFormSchema = yup.object().shape({
  name: yup.string().required("Required"),
});
