import { SafeParseError } from "zod";

export type FormState<T> =
  | {
      errors?: T;
      message?: string;
    }
  | undefined;

type ActionState =
  | {
      message: string;
      errors: undefined;
      success: boolean;
    }
  | undefined;

export type UseActionState = [
  ActionState,
  (payload: FormData) => void,
  boolean
];

export function getValidationErrors<T>(validation: SafeParseError<T>) {
  return {
    errors: validation.error.flatten().fieldErrors,
    message: undefined,
    success: false,
  };
}

export function getActionError(message: string) {
  return { message, errors: undefined, success: false };
}

export function getSuccess() {
  return { message: undefined, errors: undefined, success: true };
}
