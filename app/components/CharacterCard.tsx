import { Character } from "../lib/types";

type Props = {
  character: Character;
  onUpdateName: (id: number, value: string) => void;
  onUpdateStat: (id: number, stat: "health" | "movement" | "actions", value: string) => void;
};

export default function CharacterCard({ character, onUpdateName, onUpdateStat }: Props) {
  return (
    <article className="card">
      <p className="slot">Character {character.id}</p>
      <label>
        Name
        <input value={character.name} onChange={(event) => onUpdateName(character.id, event.target.value)} />
      </label>

      <div className="statsGrid">
        <label>
          Health Points
          <input
            type="number"
            min={0}
            value={character.health}
            onChange={(event) => onUpdateStat(character.id, "health", event.target.value)}
          />
        </label>

        <label>
          Movement Points
          <input
            type="number"
            min={0}
            value={character.movement}
            onChange={(event) => onUpdateStat(character.id, "movement", event.target.value)}
          />
        </label>

        <label>
          Action Points
          <input
            type="number"
            min={0}
            value={character.actions}
            onChange={(event) => onUpdateStat(character.id, "actions", event.target.value)}
          />
        </label>
      </div>
    </article>
  );
}
