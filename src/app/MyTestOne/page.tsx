"use client";
import * as React from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const { register, handleSubmit } = useForm();
  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <input {...register("firstname")} placeholder="First name" />
        <input {...register("lastname")} placeholder="Last name" />
        <input type="submit" />
      </form>
    </div>
  );
}
