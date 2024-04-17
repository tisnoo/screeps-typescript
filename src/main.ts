import { ErrorMapper } from "utils/ErrorMapper";
import { roleHarvester } from "./utils/roles/roleHarvester";
import { roleBuilder } from "./utils/roles/roleBuilder";
import { roleUpgrader } from "./utils/roles/roleUpgrader";
import { countCreepsOfRole } from "./utils/countCreepsOfRole";
import { CreepRole } from "./utils/roles/CreepRole";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  console.log(countCreepsOfRole(CreepRole.HARVESTER))
  console.log(countCreepsOfRole(CreepRole.BUILDER))
  console.log(countCreepsOfRole(CreepRole.UPGRADER))

  if (countCreepsOfRole(CreepRole.HARVESTER) < 1) {
    Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], CreepRole.HARVESTER+Game.time.toString(), { memory: { role: CreepRole.HARVESTER, room: 'room1', working: true } });
  } else if (countCreepsOfRole(CreepRole.UPGRADER) < 1) {
    Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], CreepRole.UPGRADER+Game.time.toString(), { memory: { role: CreepRole.UPGRADER, room: 'room1', working: true } });
  } else if (countCreepsOfRole(CreepRole.BUILDER) < 1) {
    Game.spawns['Spawn1'].spawnCreep([WORK, MOVE, CARRY], CreepRole.BUILDER+Game.time.toString(), { memory: { role: CreepRole.BUILDER, room: 'room1', working: true } });
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      continue;
    }

    const creep = Game.creeps[name];

    if (creep.memory.role == CreepRole.HARVESTER) {
      roleHarvester(creep);
    }
    if (creep.memory.role == CreepRole.UPGRADER) {
      roleUpgrader(creep);
    }
    if (creep.memory.role == CreepRole.BUILDER) {
      roleBuilder(creep);
    }
  }
});
