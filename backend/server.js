import app from "./src/app.js";
import config from "./src/config.js";

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
