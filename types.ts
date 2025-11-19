
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (P, I, O...)
  color?: string;
  targetIndex?: number; // Index in the PIONEER target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Vibe Code Pioneers Palette: Warm, Energetic, Creative
// Gradient from Orange/Gold -> Pink/Magenta -> Deep Purple
export const GEMINI_COLORS = [
    '#FF6D00', // P - Deep Orange
    '#FF9100', // I - Bright Orange
    '#FF0054', // O - Pink/Red
    '#D500F9', // N - Neon Purple
    '#AA00FF', // E - Deep Purple
    '#6200EA', // E - Royal Purple
    '#FF6D00', // R - Back to Orange (Loop)
];

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
}
