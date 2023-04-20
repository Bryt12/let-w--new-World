import { w } from './main.js';

// This is a terrible hack, it leaks the API key to the client.
// Although it does not leak the key to the github project.
// I will fix this later as ideally there should be a server
// to proxy the requests to the OpenAI API as not to leak the key.
// I will also add a rate limiter to the server to prevent abuse
// of the API key. For now this is the solution as I want
// people to be able to play with the AI locally, I don't plan
// on hosting this project until I add a server.
import { OPENAI_API_KEY } from './env.js';

export class LLM {
  constructor() {}

  async getChatGPTResponse(text: string) {
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

    let out = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        max_tokens: 100,
      }),
    });

    return (await out.json()).choices[0].message;
  }
}
