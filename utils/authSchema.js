import * as Yup from "yup";

const signUpValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required.")
    .min(3, "Name must be atleast 6 characters long."),

  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format."),

  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be atleast 6 characters long."),
});

const signInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .email("Invalid email format."),

  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be atleast 6 characters long."),
});

export { signInValidationSchema, signUpValidationSchema };

