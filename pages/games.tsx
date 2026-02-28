import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";

type Cell = "X" | "O" | null;

export default function Game() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isDraw, setIsDraw] = useState(false);
  const [stackScore, setStackScore] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreboard, setScoreboard] = useState<[]>([]);
  const { data: session } = useSession();
  const ScoreboardContent = ({ scoreboard }: any) => (
    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
      {scoreboard.map((item: any, index: number) => (
        <div
          key={index}
          className="flex justify-between px-4 py-2 rounded-lg border"
        >
          <span className="font-medium">
            #{index + 1} {item.name}
          </span>
          <span className="font-bold">{item.score ?? 0}</span>
        </div>
      ))}
    </div>
  );
  useEffect(() => {
    const loadScore = async () => {
      if (!session?.user?.email) return;

      const response = await getScore(session.user.email, "POST");
      setScore(response.score);
    };
    const loadScoreboard = async () => {
      const response = await getScore("", "GET");
      setScoreboard(response);
    };
    loadScore();
    loadScoreboard();
  }, [session]);

  setInterval(
    () => {
      const loadScoreboard = async () => {
        const response = await getScore("", "GET");
        setScoreboard(response);
      };
      loadScoreboard();
    },
    5 * 60 * 1000,
  );
  const sendResult = async (result: "win" | "lose") => {
    await fetch("/api/game-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
  };
  const getScore = async (email: string, method: "POST" | "GET") => {
    const res = await fetch("/api/score", {
      method,
      headers: { "Content-Type": "application/json" },
      ...(method === "POST" && {
        body: JSON.stringify({ email }),
      }),
    });

    return await res.json();
  };

  const checkWinner = (b: Cell[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  };
  const checkDraw = (b: Cell[]) => {
    return b.every((cell) => cell !== null);
  };
  const handleClick = async (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setWinner("player");
      await sendResult("win");
      const responseWin = await getScore(session?.user?.email as any, "POST");

      setScore(responseWin["score"]);
      setStackScore(responseWin["winStreak"]);

      return;
    }
    // console.log(`newBoard ==> ${newBoard}`);
    // console.log(`checkDraw ==> ${checkDraw(newBoard)}`);
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      return;
    }
    setIsPlayerTurn(false);
    setTimeout(() => botMove(newBoard), 500);
  };

  const botMove = async (currentBoard: Cell[]) => {
    const emptyIndexes = currentBoard
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null) as number[];

    if (emptyIndexes.length === 0) return;

    const randomIndex =
      emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      // setScore(score == 0 ? score : score - 1);
      // setStackScore(0);
      setWinner("bot");
      sendResult("lose");
      const responseWin = await getScore(session?.user?.email as any, "POST");

      setScore(responseWin["score"]);
      setStackScore(responseWin["winStreak"]);

      return;
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true);
      return;
    }
    setIsPlayerTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setIsPlayerTurn(true);
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
    lg:hidden
    fixed
    bottom-6
    right-6
    bg-blue-500
    text-white
    px-4
    py-3
    rounded-full
    shadow-lg
    hover:bg-blue-600
    transition
  "
      >
        🏆
      </button>

      {/* ================= GAME (Centered) ================= */}
      <div className="flex flex-col items-center justify-center  gap-6">
        <h1 className="text-3xl font-bold">Tic Tac Toe</h1>

        <div className="text-lg font-semibold flex flex-col items-center gap-1">
          <p>Turn : {isPlayerTurn ? "You" : "Bot"}</p>
          <p>Score : {score}</p>

          {stackScore >= 2 && (
            <p className="text-orange-500 animate-pulse">
              🔥 Need 1 more win for Bonus!
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {board.map((cell, i) => (
            <button
              disabled={!isPlayerTurn}
              key={i}
              onClick={() => handleClick(i)}
              className={`
              w-24 h-24
              border-2 border-gray-400
              rounded-xl
              text-3xl font-bold
              flex items-center justify-center
              bg-white
              shadow-sm
              transition
              ${isPlayerTurn ? "hover:bg-gray-100" : "bg-gray-100"}
            `}
            >
              {cell === "X" && <span className="text-blue-500">X</span>}
              {cell === "O" && <span className="text-red-500">O</span>}
            </button>
          ))}
        </div>
        {(winner || isDraw) && (
          <div className="flex flex-col items-center gap-4">
            {" "}
            <h2 className="text-xl font-semibold">
              {" "}
              {winner === "player" && "You Win 🎉"}{" "}
              {winner === "bot" && "Bot Wins 🤖"}{" "}
              {isDraw && "It's a Draw 😎"}{" "}
            </h2>{" "}
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {" "}
              Play Again{" "}
            </button>{" "}
          </div>
        )}
      </div>
      {/* Mobile Panel */}
      <button
        className={`
    lg:hidden
    fixed
    inset-0
    bg-black/40
    transition
    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
  `}
        onClick={() => setIsOpen(false)}
      >
        <button
          className={`
      absolute
      bottom-0
      w-full
      bg-black
      rounded-t-3xl
      p-6
      transition-transform
      duration-300
      ${isOpen ? "translate-y-0" : "translate-y-full"}
    `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🏆 Scoreboard Top 5</h2>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <ScoreboardContent scoreboard={scoreboard} />
        </button>
      </button>
      {/* ================= SCOREBOARD (Fixed Right) ================= */}
      <div
        className="
    hidden lg:block
    w-72
    fixed
    right-4
    top-1/2
    -translate-y-1/2
    rounded-2xl
    shadow-2xl
    p-6
    border
    border-gray-200
  "
      >
        <ScoreboardContent scoreboard={scoreboard} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: "/api/auth/signin" },
    };
  }

  return { props: {} };
}
