import * as fs from "fs";

import { SlippiGame } from "@slippi/slippi-js";
import { GameDetails } from "./stats/types";

export function readFileAsGameDetails(file: string): GameDetails {
  const game = readFileAsSlippiGame(file);
  return generateGameDetails(file, game);
}

function readFileAsSlippiGame(file: string): SlippiGame {
  const buf = fs.readFileSync(file);
  return new SlippiGame(buf);
}

function generateGameDetails(name: string, game: SlippiGame): GameDetails {
  // For a valid SLP game, at the very least we should have valid settings
  const settings = game.getSettings();
  if (!settings) {
    throw new Error(`Invalid SLP file. Could not find game settings in file: ${name}`);
  }

  const stats = game.getStats();
  if (!stats) {
    throw new Error(`Failed to process game stats for file: ${name}`);
  }

  const metadata = game.getMetadata();
  if (!metadata) {
    throw new Error(`Failed to load metadata for file: ${name}`);
  }

  return {
    filePath: name,
    settings,
    frames: game.getFrames(),
    stats,
    metadata,
    latestFrame: game.getLatestFrame(),
    gameEnd: game.getGameEnd(),
  };
}
