"use client";

import { Span } from "next/dist/trace";
import { preguntas } from "../data.json";
import React, { useState } from "react";

export interface Question {
  id: number;
  texto: string;
}

interface Answer extends Question {
  valoracion: 1 | 2 | 3 | 4 | 5;
}

const questions: Question[] = preguntas;

function Rating({
  value,
  onChange,
  isReadOnly,
}:
  | {
      value: Answer["valoracion"];
      onChange: (value: Answer["valoracion"]) => void;
      isReadOnly?: false;
    }
  | {
      value: Answer["valoracion"];
      isReadOnly: boolean;
      onChange?: never;
    }) {
  const [hoverValue, setHoverValue] = useState<Answer["valoracion"]>(value);

  return (
    <div
      className="text-2xl text-yellow-500"
      onMouseLeave={() => setHoverValue(value)}
    >
      {"★"
        .repeat(hoverValue || value)
        .padEnd(5, "☆")
        .split("")
        .map((elem, index) => (
          <span
            key={index}
            className={!isReadOnly ? "cursor-pointer" : ""}
            onClick={() =>
              !isReadOnly && onChange?.((index + 1) as Answer["valoracion"])
            }
            onMouseOver={() =>
              !isReadOnly && setHoverValue((index + 1) as Answer["valoracion"])
            }
          >
            {elem}
          </span>
        ))}
    </div>
  );
}

export default function Home() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const currentQuestion = questions[answers.length];

  function handleRate(rating: Answer["valoracion"]) {
    setAnswers((answers) =>
      answers.concat({
        ...currentQuestion,
        valoracion: rating,
      })
    );
  }

  if (!currentQuestion) {
    return (
      <ul className="rounded-md border">
        {answers.map((answer) => (
          <li
            key={answer.id}
            className="flex items-center justify-between p-2  "
          >
            {answer.texto} <Rating isReadOnly value={answer.valoracion} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="text-center">
      <h1 className="text-xl">{currentQuestion.texto}</h1>
      <Rating value={1} onChange={handleRate} />
    </div>
  );
}
