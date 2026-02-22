"use client";

import { FormEvent, useMemo, useState } from "react";
import CharacterCard from "./components/CharacterCard";
import { clampToZero, parseCommand } from "./lib/commandParser";
import { Character } from "./lib/types";

const defaultCharacters: Character[] = [
  { id: 1, name: "Character 1", health: 10, movement: 6, actions: 2 },
  { id: 2, name: "Character 2", health: 10, movement: 6, actions: 2 },
  { id: 3, name: "Character 3", health: 10, movement: 6, actions: 2 }
];

const commandHelp =
  "Try: 'character 1 used 2 movement points and took damage of 2 health points and used 1 action point', or 'Aria took 2 points of damage'.";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters);
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState(commandHelp);
  const [history, setHistory] = useState<string[]>([]);

  const partySummary = useMemo(() => characters.map((item) => item.name).join(", "), [characters]);

  const updateName = (id: number, value: string) => {
    setCharacters((prev) => prev.map((character) => (character.id === id ? { ...character, name: value } : character)));
  };

  const updateStat = (id: number, stat: "health" | "movement" | "actions", value: string) => {
    const parsed = Number(value);
    const safeValue = Number.isNaN(parsed) ? 0 : clampToZero(parsed);

    setCharacters((prev) =>
      prev.map((character) => (character.id === id ? { ...character, [stat]: safeValue } : character))
    );
  };

  const applyCommand = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = command.trim();

    if (!trimmed) {
      setStatus("Please enter a console command first.");
      return;
    }

    const parsed = parseCommand(trimmed, characters.map((item) => item.name));

    if (parsed.targetIndex === null) {
      setStatus("Could not find character target. Use 'character 1' or type the character name in the command.");
      return;
    }

    if (parsed.healthDelta === 0 && parsed.movementDelta === 0 && parsed.actionsDelta === 0) {
      setStatus("No update found in command. Mention movement, damage/health, or actions.");
      return;
    }

    const target = characters[parsed.targetIndex];
    const summary = `${target.name}: ${parsed.healthDelta} HP, ${parsed.movementDelta} movement, ${parsed.actionsDelta} actions`;

    setCharacters((prev) =>
      prev.map((character, index) => {
        if (index !== parsed.targetIndex) return character;

        return {
          ...character,
          health: clampToZero(character.health + parsed.healthDelta),
          movement: clampToZero(character.movement + parsed.movementDelta),
          actions: clampToZero(character.actions + parsed.actionsDelta)
        };
      })
    );

    setHistory((prev) => [summary, ...prev].slice(0, 10));
    setStatus(`Applied: ${summary}`);
    setCommand("");
  };

  const resetAll = () => {
    setCharacters(defaultCharacters);
    setHistory([]);
    setStatus("All characters reset to defaults.");
  };

  return (
    <main className="container">
      <h1>Next.js DnD Tracker</h1>
      <p className="small">Party: {partySummary}</p>

      <section className="cards">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} onUpdateName={updateName} onUpdateStat={updateStat} />
        ))}
      </section>

      <section className="console">
        <h2>Basic Console</h2>
        <p className="small">{commandHelp}</p>
        <form onSubmit={applyCommand}>
          <textarea
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="character 1 used 2 movement points and took damage of 2 health points"
          />
          <div className="buttonRow">
            <button type="submit">Apply command</button>
            <button type="button" className="secondary" onClick={resetAll}>
              Reset all
            </button>
          </div>
        </form>

        <p className="status">{status}</p>

        {history.length > 0 && (
          <div className="history">
            <h3>Recent updates</h3>
            <ul>
              {history.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
