# Tesla Parts

Web app for browsing Tesla parts, creating orders, and managing products through an admin panel.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app from the project root:
   `npm run dev`

> Важно: фронтенд и API работают вместе через `server.ts` на `http://localhost:3000`. Не запускайте только `dotnet run`, иначе `/api/orders` будет обращаться не к нужному серверу.
> If you run the UI on a different host in development, API calls still go to `http://localhost:3000` by default. You can override this with `VITE_API_URL` if needed.
