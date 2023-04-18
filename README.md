Install [Nodejs](https://nodejs.org/en/download)

Install [http-server](https://www.npmjs.com/package/http-server)

`git clone https://github.com/Bryt12/let-w--new-World`

`cd let-w--new-World`

Make a file src/env.ts with the following content:

```typescript
export const OPENAI_API_KEY = <your openai api key>;
```

`npm install`

`npm run build`

`http-server`

Go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

[ChatGPT](http://chat.openai.com/) can give you more details if you need them, just copy paste these instructions and as it to provide more details.

THERE APPEARS TO BE A BUG IN @types/p5 IN THE FILE global.d.ts THE FIX IS 

line 1990 
function normal(vector: p5.Vector): p5;

line 9009
): p5.SoundFile;

YOU WILL HAVE TO MANUALLY EDIT THE FILE node_modules/@types/p5/global.d.ts

I HAVE A PR FOR THIS, SEE ITS STATUS HERE

https://github.com/DefinitelyTyped/DefinitelyTyped/pull/65202
