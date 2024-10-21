import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import Header from "../../../components/Header";
import AuthForm from "../../../components/AuthForm";
import { FormikHelpers } from "formik";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (
    values: { username: string; password: string },
    { setStatus }: FormikHelpers<{ username: string; password: string }>
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
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
