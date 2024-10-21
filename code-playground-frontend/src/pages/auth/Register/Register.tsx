import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/Button";
import { Input } from "@nextui-org/input";
import Header from "../../../components/Header";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

const registerSchema = Yup.object().shape({
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
});

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (
    values: { username: string; password: string },
    {
      setStatus,
      setSubmitting,
    }: FormikHelpers<{ username: string; password: string }>
  ) => {
    try {
      await register(values.username, values.password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <div className="p-6 bg-zinc-800 rounded-lg shadow-md mx-auto my-auto w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched, status, isSubmitting }) => (
            <Form className="space-y-4">
              {status && (
                <div className="text-pink-700 text-sm mb-2">{status}</div>
              )}
              <div className="h-[70px]">
                <Field name="username">
                  {({ field }: { field: any }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Username"
                      labelPlacement="inside"
                      className="bg-transparent"
                      isInvalid={!!(errors.username && touched.username)}
                      errorMessage={touched.username && errors.username}
                      classNames={{
                        inputWrapper:
                          "bg-zinc-700 data-[hover=true]:bg-zinc-700 group-data-[focus=true]:bg-zinc-700  group-data-[hover=true]:!bg-zinc-700 group-data-[focus=true]:!bg-zinc-700 !bg-zinc-700",
                        input:
                          "text-white group-data-[has-value=true]:text-white group-data-[focus=true] relative",
                        label:
                          "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
                      }}
                    />
                  )}
                </Field>
              </div>
              <div className="h-[70px]">
                <Field name="password">
                  {({ field }: { field: any }) => (
                    <Input
                      {...field}
                      type="password"
                      label="Password"
                      labelPlacement="inside"
                      className="bg-transparent"
                      isInvalid={!!(errors.password && touched.password)}
                      errorMessage={touched.password && errors.password}
                      classNames={{
                        inputWrapper:
                          "bg-zinc-700 data-[hover=true]:bg-zinc-700 group-data-[focus=true]:bg-zinc-700  group-data-[hover=true]:!bg-zinc-700 group-data-[focus=true]:!bg-zinc-700 !bg-zinc-700",
                        input:
                          "text-white group-data-[has-value=true]:text-white group-data-[focus=true] relative",
                        label:
                          "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
                      }}
                    />
                  )}
                </Field>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
        <div className="w-full mt-4 text-center text-sm">
          Already have an account?{" "}
        </div>
        <div className="w-full text-center text-sm underline font-semibold">
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
