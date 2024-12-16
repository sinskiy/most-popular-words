"use client";

import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import { logIn } from "../../actions/auth";
import { useActionState } from "react";

export default function LogIn() {
  const [state, action, pending] = useActionState(logIn, undefined);

  return (
    <Form
      action={action}
      pending={pending}
      heading="log in"
      message={state?.message}
    >
      <InputField
        id="username"
        type="text"
        autoComplete="username"
        error={state?.errors?.username}
      />
      <InputField
        id="password"
        type="password"
        autoComplete="current-password"
        error={state?.errors?.password}
      />
    </Form>
  );
}
