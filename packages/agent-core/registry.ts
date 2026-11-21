import { createRegistry, type Registry } from "@earendil-works/pi-durable";
import { CodingTools } from "@earendil-works/pi-durable/tools";
import { agentConfig, botConfig } from "./configs";

export function Registry(): Registry {
    const registry = createRegistry();
    registry.install(CodingTools);
    registry.install(agentConfig);
    registry.install(botConfig);

    return registry
}
