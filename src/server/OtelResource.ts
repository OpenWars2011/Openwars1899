import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { ServerEnv } from "./ServerEnv";

export function getOtelResource() {
  return resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "openfront",
    [ATTR_SERVICE_VERSION]: "1.0.0",
    ...getPromLabels(),
  });
}

export function getPromLabels() {
  const workerId = ServerEnv.workerId();
  return {
    "service.instance.id": ServerEnv.hostname(),
    "OpenWars.environment": ServerEnv.env(),
    "OpenWars.host": ServerEnv.host(),
    "OpenWars.domain": ServerEnv.domain(),
    "OpenWars.subdomain": ServerEnv.subdomain(),
    "OpenWars.component":
      workerId !== undefined ? "Worker " + workerId : "Master",
  };
}
