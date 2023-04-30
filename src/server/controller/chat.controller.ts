import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';

export const conversation = async (req: any, res: any) => {
  try {
    const { messages } = req.body;

    const modelName = 'gpt-3.5-turbo',
      temperature = 0.5,
      maxTokens = 100;

    const history = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.role === 'system') {
        history.push(new SystemChatMessage(message.content));
      } else if (message.role === 'assistant') {
        history.push(new AIChatMessage(message.content));
      } else {
        history.push(new HumanChatMessage(message.content));
      }
    }

    console.log('----history-----');
    console.log(history);
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName,
      temperature,
      maxTokens,
      streaming: true,
    });

    const out = await chat.call(history, undefined, [
      {
        handleLLMNewToken(token: string) {
          console.log({ token });
        },
      },
    ]);

    console.log(messages);
    console.log(out);

    return out;
  } catch (e) {
    console.log(e);
    res.status(500);
  }
};
