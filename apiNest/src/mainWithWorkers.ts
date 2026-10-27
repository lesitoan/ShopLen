import { createApplication } from "@/bootstrap.js";
import { EnvService } from "@/config/env.service.js";
import { RuntimeModule } from "@/runtime/runtime.module.js";

const app = await createApplication(RuntimeModule);
await app.listen(app.get(EnvService).values.PORT);
