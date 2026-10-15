"use client";

import {useState} from "react";

type CounterProps = {
  title: string;
};

export default function Counter({title}: CounterProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>

      <p className="mb-3">Button clicked: {count} times</p>

      <button
        onClick={() => setCount(count + 1)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        Click me
      </button>
    </div>
  );
}
