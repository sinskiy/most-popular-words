import Form from "../../components/form";
import InputField from "../../components/input-field";

export default function SignUp() {
  return (
    <Form>
      <InputField id="username" type="text" autoComplete="username" />
      <InputField id="password" type="password" autoComplete="new-password" />
    </Form>
  );
}
