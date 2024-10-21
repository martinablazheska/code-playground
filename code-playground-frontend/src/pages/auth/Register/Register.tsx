import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { FormikHelpers } from "formik";

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
      <AuthForm type="register" onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
