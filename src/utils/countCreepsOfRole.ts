import { CreepRole } from "./roles/CreepRole";

export function countCreepsOfRole(role: CreepRole): number {
  return Object.keys(Game.creeps).filter(e => Game.creeps[e].memory.role === role).length;
}
