import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/Button";
import { Input } from "@nextui-org/input";
import Header from "../../../components/Header";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (
    values: { username: string; password: string },
    { setStatus }: { setStatus: (status: string) => void }
  ) => {
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <div className="p-6 bg-zinc-800 rounded-lg shadow-md mx-auto my-auto w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
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
                          "text-white group-data-[has-value=true]:text-white group-data-[focus=true] ",
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
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <div className="w-full mt-4 text-center text-sm">
          Don't have an account yet?
        </div>
        <div className="w-full  text-center text-sm underline font-semibold">
          <Link to={"/register"}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
