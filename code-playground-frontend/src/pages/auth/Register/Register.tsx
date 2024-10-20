import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../../components/Button";
import { Input } from "@nextui-org/input";
import Header from "../../../components/Header";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col  min-h-screen bg-zinc-900">
      <Header />
      <div className="p-6 bg-zinc-800 rounded-lg shadow-md mx-auto my-auto">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            value={username}
            onValueChange={setUsername}
            label="Username"
            labelPlacement="inside"
            className="bg-transparent"
            isRequired
            isClearable
            classNames={{
              inputWrapper:
                "bg-zinc-700 data-[hover=true]:bg-zinc-700 group-data-[focus=true]:bg-zinc-700",
              input:
                "text-white group-data-[has-value=true]:text-white group-data-[focus=true]",
              label:
                "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
            }}
          />
          <Input
            type="password"
            value={password}
            onValueChange={setPassword}
            label="Password"
            labelPlacement="inside"
            className="bg-transparent"
            isRequired
            isClearable
            classNames={{
              inputWrapper:
                "bg-zinc-700 data-[hover=true]:bg-zinc-700 group-data-[focus=true]:bg-zinc-700",
              input:
                "text-white group-data-[has-value=true]:text-white group-data-[focus=true]",
              label:
                "text-white group-data-[filled-within=true]:text-white placeholder:text-white",
            }}
          />
          <Button type="submit" className="w-full" size="lg">
            Register
          </Button>
        </form>
        <div className="w-full mt-4 text-center text-sm">
          Already have an account?{" "}
        </div>
        <div className="w-full  text-center text-sm underline font-semibold">
          <Link to={"/login"}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;