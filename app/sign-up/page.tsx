"use client";

import Form from "../../components/form";
import InputField from "../../components/input-field";
import { signUp } from "../../actions/auth";
import { useActionState } from "react";

export default function SignUp() {
  const [state, action, pending] = useActionState(signUp, undefined);

  return (
    <Form
      action={action}
      pending={false}
      heading="sign up"
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
        autoComplete="new-password"
        error={state?.errors?.password}
        errorAsArray
      />
    </Form>
  );
}
