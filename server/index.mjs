import { createApp } from './app.mjs';
import { getServerPort } from './config/env.mjs';
import { connectToDatabase } from './lib/mongoose.mjs';

const port = getServerPort();
const app = createApp();

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Spin backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start spin backend:', error);
    process.exit(1);
  });
