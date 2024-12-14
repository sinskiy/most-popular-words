"use server";
import { FormState, UserFormSchema } from "../lib/definitions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import db from "../configs/pg";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "../types/user";
import { getErrorMessage } from "../lib/helpers";
import { revalidateTag, unstable_cache } from "next/cache";

type AuthFormState = FormState<{
  username?: string[];
  password?: string[];
}>;

export async function signUp(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const userWithUsername = await db.query(
      "SELECT username FROM users WHERE username = $1",
      [username]
    );
    if (userWithUsername?.rowCount !== 0) {
      return { message: "User with this username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    const user = data.rows[0];

    if (!user) {
      return { message: "Couldn't create user" };
    }
  } catch (e) {
    return getErrorMessage(e);
  }

  redirect("/log-in");
}

export async function logIn(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validatedFields = UserFormSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const userWithUsername = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userWithUsername?.rowCount === 0) {
      return { message: "User with this username doesn't exist" };
    }

    const user = userWithUsername.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { message: "Passwords do not match" };
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET!,
      {
        expiresIn: "30d",
      }
    );
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  } catch (e) {
    return getErrorMessage(e);
  }

  revalidateTag("user");

  redirect("/");
}

export const getUserFromDb = unstable_cache(
  async (username: string) =>
    await db.query(
      "SELECT username, streak, last_streak FROM users WHERE username = $1",
      [username]
    ),
  ["user"],
  { revalidate: 60 * 60, tags: ["user"] }
);

export async function getUser(): Promise<User | false> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return false;

    const { username } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const data = await getUserFromDb(username);

    const user = data.rows[0];
    if (!user) {
      return false;
    }

    return user;
  } catch {
    return false;
  }
}

export async function logOut() {
  try {
    (await cookies()).set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
  } catch (err) {
    return err;
  }
}
