export type FormState<T> =
  | {
      errors?: T;
      message?: string;
    }
  | undefined;

type ActionState =
  | {
      message: string;
      success: undefined;
    }
  | { success: boolean; message: undefined }
  | undefined;

export type UseActionState = [
  ActionState,
  (payload: FormData) => void,
  boolean
];
