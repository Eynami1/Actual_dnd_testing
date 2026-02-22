import { ParsedCommand } from "./types";

export function clampToZero(value: number): number {
  return Math.max(value, 0);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseCharacterTarget(command: string, characterNames: string[]): number | null {
  const numberedMatch = command.match(/(?:character|char)\s*(\d+)/i);
  if (numberedMatch) {
    const index = Number(numberedMatch[1]) - 1;
    if (!Number.isNaN(index) && index >= 0 && index < characterNames.length) return index;
  }

  for (let index = 0; index < characterNames.length; index += 1) {
    const name = characterNames[index].trim();
    if (!name) continue;
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
    if (pattern.test(command)) return index;
  }

  return null;
}

function findSignedValue(command: string, patterns: { regex: RegExp; sign: 1 | -1 }[]): number {
  for (const { regex, sign } of patterns) {
    const match = command.match(regex);
    if (match) return sign * Number(match[1]);
  }
  return 0;
}

function parseHealthDelta(command: string): number {
  return findSignedValue(command, [
    {
      regex: /(?:took|takes|lost|lose)\s*(?:damage\s*(?:of\s*)?)?(\d+)\s*(?:health\s*points?|hp|health|points\s*of\s*damage|damage\s*points?|damage)?/i,
      sign: -1
    },
    {
      regex: /(?:damage(?:d)?\s*(?:of\s*)?)(\d+)\s*(?:health\s*points?|hp|health|damage\s*points?)?/i,
      sign: -1
    },
    {
      regex: /(\d+)\s*(?:points?\s*of\s*damage)/i,
      sign: -1
    },
    {
      regex: /(?:healed|heal|gained|gain|recovered|recover)\s*(\d+)\s*(?:health\s*points?|hp|health)?/i,
      sign: 1
    }
  ]);
}

function parseMovementDelta(command: string): number {
  return findSignedValue(command, [
    {
      regex: /(?:used|spent)\s*(\d+)\s*(?:movement\s*points?|move\s*points?|movement|move|moves|tiles?)/i,
      sign: -1
    },
    {
      regex: /(?:gained|gain|restored|restore)\s*(\d+)\s*(?:movement\s*points?|move\s*points?|movement|move|moves|tiles?)/i,
      sign: 1
    }
  ]);
}

function parseActionsDelta(command: string): number {
  return findSignedValue(command, [
    {
      regex: /(?:used|spent)\s*(\d+)\s*(?:action\s*points?|actions?|attacks?)/i,
      sign: -1
    },
    {
      regex: /(?:gained|gain|restored|restore)\s*(\d+)\s*(?:action\s*points?|actions?|attacks?)/i,
      sign: 1
    }
  ]);
}

export function parseCommand(command: string, characterNames: string[]): ParsedCommand {
  return {
    targetIndex: parseCharacterTarget(command, characterNames),
    healthDelta: parseHealthDelta(command),
    movementDelta: parseMovementDelta(command),
    actionsDelta: parseActionsDelta(command)
  };
}
