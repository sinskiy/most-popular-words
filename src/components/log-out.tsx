"use client";

import { logOut } from "@/users/auth";

export default function LogOut() {
  function localLogOut() {
    logOut();
    localStorage.clear();
  }

  return (
    <button onClick={localLogOut} className="button">
      log out
    </button>
  );
}
