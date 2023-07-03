import * as yup from "yup";

export const eventFormSchema = yup.object().shape({
  // title: yup.string().required("Required"),
  // endDate: yup.string("Enter the correct date").required("Required"),
  // startDate: yup.string("Enter the correct date").required("Required"),
  // startDateTime: yup.string("Enter the correct date").required("Required"),
  // endDateTime: yup.string("Enter the correct date").required("Required"),
  start: yup.string("Enter the correct date").required("Required"),
  end: yup.string("Enter the correct date").required("Required"),
  color: yup.string("Enter the correct color").required("Required"),
  description: yup.string(),
  location: yup.string(),
  allDay: yup.boolean().required("Required"),
});
