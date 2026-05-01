import * as inquirer from '@inquirer/prompts';
import chalk from 'chalk';
import * as json5 from 'json5';
import * as fs from 'fs';
import wrapAnsi from 'wrap-ansi';
import { exec } from 'child_process';

export default async function main() {
    console.clear();

    const colorTransformer = (t: string) => chalk.magenta(t);
    const theme = {
        style: {
            answer: colorTransformer,
            description: colorTransformer,
            help: colorTransformer,
            highlight: colorTransformer,
        },
    };

    let existingConfig: Record<string, any> = {};
    let newConfig: Record<string, any> = {
        pluginVersion: 'v1.0.0',
    };
    if (fs.existsSync('luaverConfig.json5')) {
        existingConfig = json5.parse(
            fs.readFileSync('luaverConfig.json5', 'utf-8'),
        );
    }

    const setupMode = await inquirer.select({
        message: 'Please select the setup mode.',
        choices: [
            {
                name: 'Simple',
                value: 'Simple',
                description:
                    'Only set up the important information, and leave the miscellaneous info for later.',
            },
            {
                name: 'Explicit',
                value: 'Explicit',
                description:
                    "Customize every setting to your heart's content, at the cost of time.",
            },
        ],
        theme,
    });

    const questionCount = setupMode === 'Simple' ? 4 : 8;
    const num = (n: number | string, t: string) =>
        chalk.gray(`(${n}/${questionCount}) `) + t;

    newConfig.pluginName = await inquirer.input({
        message: num(1, 'Please enter a name for your plugin.'),
        required: true,
        default: existingConfig.pluginName,
        prefill: 'editable',
        transformer: colorTransformer,
    });

    newConfig.pluginAuthor = await inquirer.input({
        message: num(2, 'Please enter the author(s) for your plugin.'),
        required: true,
        default: existingConfig.pluginAuthor,
        prefill: 'editable',
        transformer: colorTransformer,
    });

    newConfig.pluginDescription = await inquirer.input({
        message: num(
            3,
            'Please enter a description for your plugin. (NOT REQUIRED)',
        ),
        default: existingConfig.pluginDescription,
        prefill: 'editable',
        transformer: colorTransformer,
    });

    const useBaseDirectory = await inquirer.confirm({
        message: num(4, 'Use current directory as the export directory?'),
        theme,
    });

    if (!useBaseDirectory) {
        newConfig.outDir = await inquirer.input({
            message: num(
                '4a',
                'In that case, please enter the desired output directory.',
            ),
            required: true,
            default: existingConfig.outDir,
            prefill: 'editable',
            transformer: colorTransformer,
        });
    } else {
        newConfig.outDir = '/';
    }

    if (setupMode === 'Simple') {
        newConfig.sources = ['QParcel', 'plugin'];
        console.log(
            chalk.greenBright(
                wrapAnsi(
                    '\nYour simple setup is now complete! Feel free to create, edit, or delete existing .lua files in your plugin folder. When you\'re ready, type "npm run dev" to compile your plugin!',
                    process.stdout.columns,
                ),
            ),
        );
        finalizeSetup(newConfig);
        return;
    }

    const options = await inquirer.checkbox({
        message: num(
            5,
            'The following checkboxes minutely change the inner workings of Luaver. Feel free to enable any or none.',
        ),
        choices: [
            {
                name: 'Disable default processors?',
                value: 'disableDefaultProcessors',
                description: wrapAnsi(
                    'By default, Luaver runs your plugin through some processors to minimize file size and make some improvements to the final product. To DISABLE this behavior, enable this setting.',
                    process.stdout.columns,
                ),
                short: 'noProcessor',
            },
            {
                name: 'Disable seed randomization?',
                value: 'dontRandomizeSeed',
                description:
                    "By default, Luaver sets the randomseed of your program to your OS's timestamp. Enable this option if you want to set the seed yourself. NOT RECOMMENDED FOR BEGINNERS.",
                short: 'noRandomSeed',
            },
            {
                name: 'Include version number in plugin title?',
                value: 'devVersionInPluginName',
                checked: true,
                description:
                    "If enabled, will include the version number in the built plugin (compiled with 'npm run dev') will include the plugin's version in its folder name and its settings.ini name, making it show in the plugin list.",
                short: 'titlebarVersion',
            },
            {
                name: "Include version number in the game's plugin list (on build only)?",
                value: 'buildVersionInPluginName',
                checked: true,
                description:
                    "If enabled, the built plugin (compiled with 'npm run build') will include the plugin's version in its folder name and its settings.ini name, making it show in the plugin list.",
                short: 'pluginListVersion',
            },
        ],
        loop: true,
        theme,
    });

    const keys = [
        'disableDefaultProcessors',
        'dontRandomizeSeed',
        'devVersionInPluginName',
        'buildVersionInPluginName',
    ];

    keys.forEach(k => {
        newConfig[k] = options.includes(k);
    });

    if (options.some(o => o.includes('VersionInPluginName'))) {
        newConfig.pluginVersion = await inquirer.input({
            message: num(
                '5a',
                'Please enter the desired version number your plugin will display.',
            ),
            required: true,
            default: existingConfig.pluginVersion ?? 'v1.0.0',
            prefill: 'editable',
            transformer: colorTransformer,
        });
    }

    let defaultSources: string[] = existingConfig.sources ?? ['plugin'];
    const sourceList = defaultSources.join(', ');

    newConfig.sources = await inquirer.input({
        message: num(
            6,
            "Please input a comma-separated list of folders that you'd like the plugin to take its Lua files from.",
        ),
        required: true,
        default: sourceList,
        prefill: 'editable',
        transformer: colorTransformer,
    });

    newConfig.sources = newConfig.sources.replaceAll(' ', '').split(',');

    newConfig.lineSeparator = await inquirer.select({
        message: num(
            7,
            'Please select the line separator used in the final plugin.',
        ),
        choices: [
            {
                name: 'LF',
                value: '\n',
                description:
                    'The recommended option. Used on every operating system except for Windows. Recommended especially for those planning to upload their plugins to GitHub.',
            },
            {
                name: 'CRLF',
                value: '\r\n',
                description:
                    "The carriage return line feed option is used primarily on Windows. Not recommended for those who aren't experienced with the technical details.",
            },
        ],
        theme,
    });

    newConfig.workshopFolder = await inquirer.input({
        message: num(
            8,
            'Please specify the folder in which your workshop data (workshop picture and workshop id) will be located. (NOT REQUIRED)',
        ),
        default: existingConfig.workshopFolder,
        prefill: 'editable',
        transformer: colorTransformer,
    });

    console.log(
        chalk.greenBright(
            wrapAnsi(
                '\nYour long-form setup is now complete! Feel free to create, edit, or delete existing .lua files in your plugin folder. When you\'re ready, type "npm run dev" to compile your plugin!',
                process.stdout.columns,
            ),
        ),
    );
    finalizeSetup(newConfig);
    return;
}

async function wrapper() {
    try {
        await main();
        exec('node dist/transpile', err => {
            if (err) throw new Error(err?.message);
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (e.name === 'ExitPromptError') {
                console.log(
                    chalk.red(
                        'You exited out of the setup process, so nothing will be updated.',
                    ),
                );
                return;
            } else {
                console.log(
                    chalk.bgRedBright(
                        chalk.black(
                            'An unknown error occurred. Please try again or report this bug on GitHub.',
                        ),
                    ),
                );

                console.log(e);
            }
        }
    }
}

function finalizeSetup(newConfig: Record<string, any>) {
    fs.writeFileSync(
        'luaverConfig.json5',
        json5.stringify(newConfig, { quote: '"', space: 4 }),
    );
    if (!process.cwd().includes('Luaver.Template'))
        fs.rmSync('.git', { recursive: true, force: true });
}

wrapper();
