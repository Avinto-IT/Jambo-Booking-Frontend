"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface SetNewPasswordProp {
  onButtonClick: () => void;
}
const SetNewPassword: React.FC<SetNewPasswordProp> = ({ onButtonClick }) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [password, setPassword] = useState({ newpassword: "", repassword: "" });
  // const [repassword,setRepassword]=useState("");
  const [message, setMessage] = useState("");

  console.log(password);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = () => {
    if (password.newpassword === "" || password.repassword === "") {
      setMessage("Password is missing");
      return;
    }

    if (
      password.newpassword === password.repassword &&
      passwordRegex.test(password.newpassword)
    )
      onButtonClick();
    else {
      setMessage("The passwords don't match");
    }
    if (!passwordRegex.test(password.newpassword)) {
      setMessage("Password not strong");
    }
  };
  setTimeout(() => {
    setMessage("");
  }, 5000);

  return (
    <div className="flex items-center justify-center  ">
      <div className="mx-auto grid  ">
        <div className="w-full flex place-content-center place-items-center">
          <div className="w-full max-w-sm  ">
            <CardHeader>
              <CardTitle className="text-3xl leading-10">
                Set a new password{" "}
              </CardTitle>
              <CardDescription>
                Create a new password. Ensure it differs from previous ones for
                security.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold">
                  Password
                </Label>
                <Input
                  id="newpassword"
                  name="newpassword"
                  type="password"
                  placeholder="Enter new password"
                  // value={newpassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold">
                  Confirm Password
                </Label>
                <Input
                  id="repassword"
                  name="repassword"
                  type="password"
                  placeholder="Re-enter password"
                  // value={repassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* <CardFooter> */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-800"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>

              {/* </CardFooter> */}
            </CardContent>

            {message && (
              <div className=" flex justify-center">
                {" "}
                <p className=" fixed w-fit px-2 shadow-xl    rounded-xl text-red-700 ">
                  {message}
                </p>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
