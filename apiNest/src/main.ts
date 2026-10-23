import { createApplication } from "@/bootstrap.js";
import { EnvService } from "@/config/env.service.js";

const app = await createApplication();
await app.listen(app.get(EnvService).values.PORT);
