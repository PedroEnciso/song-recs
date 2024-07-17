import { app } from "./app";
import { PORT } from "./src/utils/config";

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
