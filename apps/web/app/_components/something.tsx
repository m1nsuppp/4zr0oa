"use client";

import { type JSX, useState } from "react";

function generateRandomString(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function Something(): JSX.Element {
  const [something, setSomething] = useState<string>(generateRandomString());

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <p>{something}</p>
      <button onClick={() => setSomething(generateRandomString())}>
        Change something
      </button>
    </div>
  );
}
