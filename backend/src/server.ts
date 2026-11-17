import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT) || 5000;

createApp().listen(port, () => {
  console.log(`Oquraa API listening on http://localhost:${port}/api/v1`);
});
