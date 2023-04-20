import { World } from '../world.js';
import { Talkable } from '../talkable.js';
import { Singularity } from '../singularity.js';
import { NPC } from '../npc.js';
import { GrassPatch } from '../elements/grassPatch.js';
import { Room } from '../room.js';
import { Player } from '../player.js';
import {
  singularityOpening,
  singularityPassive,
} from '../dialog/singularity.js';
import {
  wandererOpening,
  wandererPassive,
  wandererPersonality,
} from '../dialog/lostWanderer.js';

import { screenWidth, screenHeight } from '../main.js';

import { dist, random } from '../util.js';

import P5 from 'p5';

export const roomsX = 5;
export const roomsY = 3;

export const loadWorld0 = (p5: P5, p: Player) => {
  const w = new World(p5, roomsX, roomsY, p);

  w.setPlayerRoom(2, 1);

  let xSpot = Math.trunc(random(0, roomsX));
  let ySpot = Math.trunc(random(0, roomsY));

  let wandererRoomX = Math.trunc(random(0, roomsX));
  let wandererRoomY = Math.trunc(random(0, roomsY));
  let wandererX = Math.trunc(random(0, screenWidth));
  let wandererY = Math.trunc(random(0, screenHeight));

  for (var i = 0; i < roomsX; i++) {
    for (var j = 0; j < roomsY; j++) {
      let npcs: Talkable[] = [];
      // If xSpot = i and ySpot = j, then we are in the room with the singularity
      // There should be 200 grass patches in this room and the patches should
      // get smaller as the distance from the singularity increases exponentially
      // The distance from the singularity should be calculated using the distance
      // formula

      let patches = calculatePatches(i, j, xSpot, ySpot);

      if (i === wandererRoomX && j === wandererRoomY) {
        let wanderer = new NPC(
          'Wanderer',
          'blue',
          50,
          wandererX,
          wandererY,
          [],
          wandererPersonality,
          wandererOpening,
          wandererPassive
        );

        npcs.push(wanderer);
      }

      if (i === xSpot && j === ySpot) {
        patches = 200;

        let sing = new Singularity(
          200,
          200,
          singularityOpening,
          singularityPassive
        );
        npcs.push(sing);
      }

      // const npc = new NPC('NPC 1', 'blue', 50, 100, 100, []);
      // npcs.push(npc);

      const grassPatches = [];
      for (var k = 0; k < patches; k++) {
        grassPatches.push(
          new GrassPatch(random(0, screenWidth), random(0, screenHeight), 7, 14)
        );
      }

      let room = new Room([], [...npcs], [...grassPatches]);
      w.setRoom(room, i, j);
    }
  }

  return w;
};

const calculatePatches = (
  xSpot: number,
  ySpot: number,
  x: number,
  y: number
) => {
  const maxDistance = dist(2, 2, roomsX, roomsY);

  // Calculate the distance from the current room to the singularity room using your dist function
  const distance = dist(x, y, xSpot, ySpot);

  // Normalize the distance
  const normalizedDistance = distance / maxDistance;

  // Calculate the number of grass patches using a linear function
  const numPatches = Math.round(200 - (200 - 0) * normalizedDistance);

  return Math.max(0, numPatches);
};
