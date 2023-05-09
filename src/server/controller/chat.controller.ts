import {
  conversation,
  extraTasks,
  extractItems,
  drawItem,
} from '../service/chat.service.js';

import { PromptTemplate } from 'langchain/prompts';

export const npcChat = async (req: any, res: any) => {
  try {
    const { messages } = req.body;

    console.log('-----Messages----');
    console.log(messages);

    const out = await conversation(messages);
    if (!out) {
      return res.status(500);
    }

    const tasks = await extraTasks(out.text);

    if (!tasks) {
      return out;
    }

    const taskList = tasks.split('\n').filter((t: any) => t !== '- no tasks');
    const sketches = [];

    const tasksOut = [];
    for (var i = 0; i < taskList.length; i++) {
      const t = taskList[i];
      const [location, task, reward] = t.split(':');

      let items = await extractItems(t);

      console.log('----items----');
      console.log(items);

      if (!items) {
        continue;
      }

      let itemsList = items.split('\n');

      console.log('----itemsList----');
      console.log(itemsList);
      for (var j = 0; j < itemsList.length; j++) {
        let script = await drawItem(itemsList[j]);

        console.log('----script----');
        console.log(script);

        if (!script || itemsList[j].indexOf('- ') === -1) {
          continue;
        }
        // remove \n from script
        script = script.replace(/\n/g, '');
        sketches.push({
          script,
          name: itemsList[j].split('- ')[1],
        });
      }

      tasksOut.push({
        location,
        task,
        sketches,
        reward,
      });
    }

    console.log('-----Task List----');
    console.log(taskList);

    return {
      tasksOut,
      out,
    };
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
