import React from "react";

const SignoutBtn = () => {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("teacher-auth");
        window.location.reload();
      }}
      className="mt-6 text-sm text-red-600 underline"
    >
      Log out
    </button>
  );
};

export default SignoutBtn;
