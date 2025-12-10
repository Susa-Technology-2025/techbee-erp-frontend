"use client";

import { useState } from "react";

type Card = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

const initialData: Column[] = [
  {
    id: "col-1",
    title: "To Do",
    cards: [
      {
        id: "card-1",
        title: "Install Plugins",
        description: "Classic WordPress ritual.",
      },
      {
        id: "card-2",
        title: "Fix Theme CSS",
        description: "Tailwind won't judge you.",
      },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    cards: [
      {
        id: "card-3",
        title: "Build Homepage",
        description: "Blocks everywhere. Chaos.",
      },
    ],
  },
  {
    id: "col-3",
    title: "Done",
    cards: [
      {
        id: "card-4",
        title: "Set Up Hosting",
        description: "At least something worked.",
      },
    ],
  },
];

export default function BoardPage() {
  const [columns] = useState(initialData);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#23282d]">Project Board</h1>

      <div className="flex gap-6 overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col.id}
            className="w-80 flex-shrink-0 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <div className="px-4 py-3 bg-[#0073aa] text-white font-semibold rounded-t-lg">
              {col.title}
            </div>

            <div className="p-4 space-y-4">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-4 shadow-sm hover:bg-gray-100"
                >
                  <h3 className="font-semibold text-[#23282d]">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
