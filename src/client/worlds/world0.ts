import { World } from '../world.js';
import { Talkable } from '../talkable.js';
import { Singularity } from '../singularity.js';
import { NPC } from '../npc.js';
import { GrassPatch } from '../elements/grassPatch.js';
import { Portal } from '../elements/portal.js';
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
import { Scenery } from '../scenery.js';

export const roomsX = 5;
export const roomsY = 3;

export const loadWorld0 = (p5: P5, p: Player) => {
  const w = new World(p5, roomsX, roomsY, p);

  w.setPlayerRoom(2, 1);

  let xSpot = Math.trunc(random(0, roomsX));
  let ySpot = Math.trunc(random(0, roomsY));

  let wandererRoomX = 2; //Math.trunc(random(0, roomsX));
  let wandererRoomY = 1; //Math.trunc(random(0, roomsY));
  let wandererX = Math.trunc(random(0, screenWidth));
  let wandererY = Math.trunc(random(0, screenHeight));

  // Get a random room for the portal
  // that is 50 pixels away from the wanderer
  // but also on the screen
  let portalX = 0;
  let portalY = 0;
  let attemps = 40;
  console.log('dist');
  for (var i = 0; i < attemps; i++) {
    portalX = Math.trunc(random(0, screenWidth));
    portalY = Math.trunc(random(0, screenHeight));
    console.log(dist(portalX, portalY, wandererX, wandererY));
    if (
      dist(portalX, portalY, wandererRoomX, wandererRoomY) > 100 &&
      portalX > 40 &&
      portalX < screenWidth - 40 &&
      portalY > 40 &&
      portalY < screenHeight - 40
    ) {
      break;
    }
  }

  for (var i = 0; i < roomsX; i++) {
    for (var j = 0; j < roomsY; j++) {
      let npcs: Talkable[] = [];
      // If xSpot = i and ySpot = j, then we are in the room with the singularity
      // There should be 200 grass patches in this room and the patches should
      // get smaller as the distance from the singularity increases exponentially
      // The distance from the singularity should be calculated using the distance
      // formula

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

      let patches = calculatePatches(i, j, xSpot, ySpot);

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

      let portal: Scenery | undefined;
      if (i === wandererRoomX && j === wandererRoomY) {
        portal = new Portal(portalX, portalY, 50, 80);
      }

      const grassPatches: Scenery[] = [];
      for (var k = 0; k < patches; k++) {
        grassPatches.push(
          new GrassPatch(random(0, screenWidth), random(0, screenHeight), 7, 14)
        );
      }

      let room = new Room(
        [],
        [...npcs],
        [...grassPatches, ...(portal ? [portal] : [])]
      );
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
