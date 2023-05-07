import { w } from './main.js';

export class LLM {
  constructor() {}

  async getChatGPTResponse(text: string, setTask: Function) {
    const chatWindow = w.getChatWindow();
    const personality = chatWindow.getCurrentPersonality();
    const history = chatWindow.getCurrentTalkableHistory();
    const prompt = `You are an NPC in a RPG video that takes place in the singularity, ${personality}.`;

    const messages: any = [{ role: 'system', content: prompt }];
    for (const message of history) {
      let r;
      if (message.role === 'user') {
        r = 'user';
      } else if (message.role === 'assistant') {
        r = 'assistant';
      } else {
        r = 'system';
      }
      messages.push({ role: r, content: message.content });
    }

    messages.push({
      role: 'user',
      content: text,
    });

    console.log('----messages-----');
    console.log(messages);

    let outObj = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
      }),
    });

    console.log(outObj);
    console.log('-------');
    let out = await outObj.json();
    console.log(out);
    console.log(out.sketches[0]);

    setTask(out.sketches[0]);

    return {
      role: 'assistant',
      content: out.out.text,
    };
  }
}
