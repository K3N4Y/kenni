import { parseArgs } from "util"

const usage = `
    kenni v1.0.0

    USAGE
        kenni [COMMAND]

    ARGUMENTS
        MESSAGES Messages to send

    FLAGS
        --model=<provider/model>  Model to use (exact with a provider: "openai-codex/gpt-6-luna")`;

const { values, positionals } = parseArgs({
    args: Bun.argv,
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
    console.log(usage)
    process.exit(1);
}
