"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, queryUser, queryUserForAuth } from "./queries";

export async function signUp(username: string, password: string) {
  try {
    const userWithUsername = await queryUserForAuth(username);
    if (userWithUsername != null) {
      throw new Error("User with this username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, hashedPassword);
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't sign up");
  }
}

export async function logIn(username: string, password: string) {
  try {
    const user = await queryUserForAuth(username);
    if (!user) {
      throw new Error("User with this username doesn't exist");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Passwords do not match");
    }

    // TODO: typesafe env
    const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
      expiresIn: "30d",
    });
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't log in");
  }

  revalidateTag("user");

  redirect("/");
}

export async function getUser() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return false;

    const { username } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    const user = await queryUser(username);

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
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't log out");
  }
}
