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
