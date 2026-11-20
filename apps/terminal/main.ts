import { parseArgs } from "util"
import { renderTUI } from "./tui/main"

const usage = `
    kenni v1.0.0

    USAGE
        kenni [COMMAND]

    ARGUMENTS
        MESSAGES Messages to send

    FLAGS
        --model=<provider/model>  Model to use (exact with a provider: "openai-codex/gpt-6-luna")`;

const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        help: {
            type: "boolean"
        },
        model: {
            type: "string"
        }
    },
    allowPositionals: true
});

if (values.help) {
    console.log(usage);
    process.exit(0);
}

const instruction = positionals.join(" ").trim();

try {
    await renderTUI(instruction || undefined);
} catch (error) {
    console.error(error);
    process.exitCode = 1;
}
