"use server";
import { FormState, UserFormSchema } from "../lib/definitions";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "../types/user";
import { getErrorMessage } from "../lib/helpers";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "../configs/prisma";

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
    const userWithUsername = await prisma.user.findUnique({
      select: { username: true },
      where: { username },
    });
    if (userWithUsername != null) {
      return { message: "User with this username already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });
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
    const user = await prisma.user.findUnique({ where: { username } });
    if (user == null) {
      return { message: "User with this username doesn't exist" };
    }

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

const getUserFromDb = unstable_cache(
  async (username: string) =>
    await prisma.user.findUnique({
      select: { id: true, username: true, streak: true, lastStreak: true },
      where: { username },
    }),
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

    const user = await getUserFromDb(username);

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
