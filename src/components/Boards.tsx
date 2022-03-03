import cn from "classnames";
import React from "react";
import { useMemo } from "react";
import {
  getGuessColors,
  NUM_BOARDS,
  NUM_GUESSES,
  useSelector,
  WORDS_VALID,
} from "../store";
import { range } from "../util";

export default function Boards() {
  return (
    <div className="boards">
      {range(NUM_BOARDS).map((i) => (
        <Board key={i} idx={i} />
      ))}
    </div>
  );
}

type BoardProps = {
  idx: number;
};
function Board(props: BoardProps) {
  const target = useSelector((s) => s.targets[props.idx]);
  const guesses = useSelector((s) => s.guesses);
  const colors = useMemo(
    () => guesses.map((guess) => getGuessColors(guess, target)),
    [guesses, target]
  );
  const guessed = useMemo(() => {
    const idx = guesses.indexOf(target);
    return idx === -1 ? null : idx;
  }, [guesses, target]);

  const boardWon = useMemo(
    () => guesses.indexOf(target) === -1,
    [target, guesses]
  );
  const gameOver = useSelector((s) => s.gameOver);
  const complete = boardWon && !gameOver;

  const input = useSelector((s) => s.input);

  return (
    <div className={cn("board", complete && "complete")}>
      {range(NUM_GUESSES).map((i) => {
        if (guessed !== null && i > guessed) {
          return <Word key={i} letters="" />;
        } else if (i === guesses.length) {
          const textRed = input.length === 5 && !WORDS_VALID.has(input);
          return <Word key={i} letters={input} textRed={textRed} />;
        } else {
          return (
            <Word key={i} letters={guesses.at(i) ?? ""} colors={colors.at(i)} />
          );
        }
      })}
    </div>
  );
}

type WordProps = {
  letters: string;
  colors?: string;
  textRed?: boolean;
};
const Word = React.memo(function (props: WordProps) {
  return (
    <>
      {range(5).map((i) => (
        <Cell
          key={i}
          letter={props.letters.at(i) ?? ""}
          textRed={props.textRed}
          color={props.colors?.at(i) as "B"}
        />
      ))}
    </>
  );
});

type CellProps = {
  letter: string;
  textRed?: boolean;
  color?: "B" | "Y" | "G";
};
function Cell(props: CellProps) {
  const color =
    props.color === "Y" ? "yellow" : props.color === "G" ? "green" : null;
  const textRed = props.textRed ? "text-red" : "";
  return (
    <div className={cn("cell", color, textRed)}>
      <span>{props.letter}</span>
    </div>
  );
}
