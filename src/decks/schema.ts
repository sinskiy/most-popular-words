import { z } from "zod";

export const AddDeckSchema = z
  .object({
    name: z.string().nonempty().max(255),
  })
  .passthrough()
  .refine(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ name, ...wordIds }) =>
      Object.keys(wordIds).filter((id) => !id.includes("$ACTION")).length > 0,
    { message: "Choose at least one word", path: [""] }
  );
