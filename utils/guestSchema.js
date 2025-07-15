import * as Yup from 'yup';

const guestValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required.")
    .min(3, "Name must be atleast 3 characters long."),

  phoneNumber: Yup.string()
    .required("Phone Number is required.").matches(/^[0-9]+$/, "Phone number must be a digit.")
    .min(10, "Phone Number must be 10 characters long."),
});

export { guestValidationSchema };

