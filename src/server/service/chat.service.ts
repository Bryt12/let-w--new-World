import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAI } from 'langchain/llms/openai';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';
import { PromptTemplate } from 'langchain/prompts';

export const conversation = async (messages: any) => {
  try {
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

    if (Math.random() > 0) {
      history.push(
        new SystemChatMessage(
          'Please respond to the user and give a task for them to retreive an item. You will pay them Sats for it.'
        )
      );
    }

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
          // console.log({ token });
        },
      },
    ]);

    return out;
  } catch (e) {
    console.log(e);
  }
};

export const extraTasks = async (inText: string) => {
  try {
    const template = `You will receive a chat message and you will create a list of tasks for the player to do in the format

      - <location>:<task>:<reward>

      If there are no tasks ONLY respond with "no tasks"

      The tasks should ONLY come from the following text, do not make up any tasks that are not explicitly in the following messagesurrounded by three backticks: \`\`\`{text}\`\`\``;
    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ['text'],
    });

    const text = await prompt.format({ text: inText });

    const modelName = 'gpt-3.5-turbo',
      temperature = 0.5,
      maxTokens = 100;

    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName,
      temperature,
      maxTokens,
      streaming: true,
    });

    const out = await model.call(text, undefined, [
      {
        handleLLMNewToken(token: string) {
          // console.log({ token });
        },
      },
    ]);

    return out;
  } catch (e) {
    console.log(e);
  }
};

export const extractItems = async (task: string) => {
  try {
    const template = `
    You will receive a task of the format:

    <location>:<task>:<reward>

    You will extract the items from the task and return them in the format:
    - <item1>
    - <item2>

    If there are no items ONLY respond with "no items"

    The items should ONLY come from the following text, do not make up any items that are not explicitly in the following message surrounded by three backticks: \`\`\`{text}\`\`\``;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ['text'],
    });

    const text = await prompt.format({ text: task });

    const modelName = 'gpt-3.5-turbo',
      temperature = 0.5,
      maxTokens = 100;

    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName,
      temperature,
      maxTokens,
      streaming: true,
    });

    const out = await model.call(text, undefined, [
      {
        handleLLMNewToken(token: string) {},
      },
    ]);

    return out;
  } catch (e) {
    console.log(e);
  }
};

export const drawItem = async (item: string) => {
  console.log('----drawItem item', item);
  console.log(item.indexOf('- '));
  if (item === 'undefined' || !item || item.indexOf('- ') === -1) {
    return;
  }

  try {
    const name = item.split('- ')[1];
    const template = `Your task is to write some code to draw the following item surrounded by three backticks: \`\`\`{text}\`\`\`
To solve this problem you will:
- First describe the item abstractly
- Create a 2D p5js script to draw the item as described, DO NOT ADD COMMENTS TO THE CODE

Using the following format:
Description: <abstract representation>

Code:
\`\`\`javascript
{{
  setup:(p) => {{
    p.createCanvas(400, 400);
  }},

  draw: (p) => {{
    ...
  }},
}};
\`\`\`
`;

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ['text'],
    });

    const text = await prompt.format({ text: name });

    console.log(1.5);
    const modelName = 'gpt-3.5-turbo',
      temperature = 0.5,
      maxTokens = 500;

    const model = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName,
      temperature,
      maxTokens,
      streaming: true,
    });

    const out = await model.call(text, undefined, [
      {
        handleLLMNewToken(token: string) {},
      },
    ]);

    if (!out) {
      return;
    }

    console.log('---out---');
    console.log(out);

    const regex = /```javascript\n([\s\S]*?)```/;

    const match = out.match(regex);

    if (match) {
      const extractedCode = match[1];

      console.log('ExtractedCode');
      console.log(extractedCode);
      return extractedCode;
    } else {
      console.log('No code found');
    }

    return out;
  } catch (e) {
    console.log(e);
  }
};
