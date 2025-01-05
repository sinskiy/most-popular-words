"use client";

import { logOut } from "../actions/auth";

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
