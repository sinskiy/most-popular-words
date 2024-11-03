import { useFormState } from "react-dom";
import Form from "../../components/form";
import InputField from "../../components/input-field";
import { signUp } from "../../actions/auth";

export default function SignUp() {
  const [state, action] = useFormState(signUp, undefined);

  return (
    <Form action={action}>
      <InputField
        id="username"
        type="text"
        autoComplete="username"
        error={state?.errors.username}
      />
      <InputField
        id="password"
        type="password"
        autoComplete="new-password"
        error={state?.errors.password}
      />
    </Form>
  );
}
