import { ParsedCommand } from "./types";

export function clampToZero(value: number): number {
  return Math.max(value, 0);
}

function parseCharacterTarget(command: string, total: number): number | null {
  const match = command.match(/(?:character|char)\s*(\d+)/i);
  if (!match) return null;

  const index = Number(match[1]) - 1;
  if (Number.isNaN(index) || index < 0 || index >= total) return null;

  return index;
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
      regex: /(?:took|takes|lost|lose)\s*(?:damage\s*(?:of\s*)?)?(\d+)\s*(?:health\s*points?|hp|health|damage\s*points?|damage)?/i,
      sign: -1
    },
    {
      regex: /(?:damage(?:d)?\s*(?:of\s*)?)(\d+)\s*(?:health\s*points?|hp|health|damage\s*points?)?/i,
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

export function parseCommand(command: string, totalCharacters: number): ParsedCommand {
  return {
    targetIndex: parseCharacterTarget(command, totalCharacters),
    healthDelta: parseHealthDelta(command),
    movementDelta: parseMovementDelta(command),
    actionsDelta: parseActionsDelta(command)
  };
}
