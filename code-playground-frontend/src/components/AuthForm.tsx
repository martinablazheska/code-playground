/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@nextui-org/input";
import Button from "@/components/Button";
import { Link } from "react-router-dom";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (
    values: { username: string; password: string },
    helpers: FormikHelpers<{ username: string; password: string }>
  ) => Promise<void>;
}

const authSchema = {
  login: Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  }),
  register: Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[a-zA-Z0-9_]{3,20}$/,
        "3-20 chars: letters, numbers, underscores only"
      )
      .required("Username is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "8+ chars: 1 upper, 1 lower, 1 number, 1 special"
      )
      .required("Password is required"),
  }),
};

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  return (
    <div className="p-6 bg-zinc-800 rounded-lg shadow-md mx-auto my-auto w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">
        {type === "login" ? "Login" : "Register"}
      </h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={authSchema[type]}
        onSubmit={onSubmit}
      >
        {({ errors, touched, status, isSubmitting }) => (
          <Form className="space-y-4">
            {status && (
              <div className="text-pink-700 text-sm mb-2">{status}</div>
            )}
            <AuthInput
              name="username"
              label="Username"
              errors={errors}
              touched={touched}
            />
            <AuthInput
              name="password"
              label="Password"
              type="password"
              errors={errors}
              touched={touched}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              {type === "login" ? "Login" : "Register"}
            </Button>
          </Form>
        )}
      </Formik>
      <div className="w-full mt-4 text-center text-sm">
        {type === "login"
          ? "Don't have an account yet?"
          : "Already have an account?"}
      </div>
      <div className="w-full text-center text-sm underline font-semibold">
        <Link to={type === "login" ? "/register" : "/login"}>
          {type === "login" ? "Register" : "Login"}
        </Link>
      </div>
    </div>
  );
};

interface AuthInputProps {
  name: string;
  label: string;
  type?: string;
  errors: any;
  touched: any;
}

const AuthInput: React.FC<AuthInputProps> = ({
  name,
  label,
  type = "text",
  errors,
  touched,
}) => (
  <div className="h-[70px]">
    <Field name={name}>
      {({ field }: { field: any }) => (
        <Input
          {...field}
          type={type}
          label={label}
          labelPlacement="inside"
          className="bg-transparent"
          isInvalid={!!(errors[name] && touched[name])}
          errorMessage={touched[name] && errors[name]}
          classNames={{
            inputWrapper:
              "bg-zinc-700 data-[hover=true]:bg-zinc-700 group-data-[focus=true]:bg-zinc-700 group-data-[hover=true]:!bg-zinc-700 group-data-[focus=true]:!bg-zinc-700 !bg-zinc-700",
            input:
              "text-white group-data-[has-value=true]:text-white group-data-[focus=true] relative",
            label:
              "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
          }}
        />
      )}
    </Field>
  </div>
);

export default AuthForm;
