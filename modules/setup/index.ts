import * as inquirer from '@inquirer/prompts';
import chalk from 'chalk';
import * as json5 from 'json5';
import * as fs from 'fs';

export default async function main() {
    let existingConfig: Record<string, any> = {};
    let newConfig: Record<string, any> = {};
    if (fs.existsSync('luaverConfig.json5')) {
        existingConfig = json5.parse(fs.readFileSync('luaverConfig.json5', 'utf-8'));
    }

    newConfig.pluginName = await inquirer.input({
        message: 'Please enter a name for your plugin.',
        required: true,
        default: existingConfig.pluginName,
        prefill: 'editable',
        transformer: (i: string) => chalk.magenta(i),
    });

    newConfig.pluginAuthor = await inquirer.input({
        message: 'Please enter the author(s) for your plugin.',
        required: true,
        default: existingConfig.pluginAuthor,
        prefill: 'editable',
        transformer: (i: string) => chalk.magenta(i),
    });

    const useBaseDirectory = await inquirer.confirm({
        message: 'Use current directory as the export directory?',
    });

    if (!useBaseDirectory) {
        newConfig.outDir = await inquirer.input({
            message: 'In that case, please enter the desired output directory.',
            required: true,
            default: existingConfig.outDir,
            prefill: 'editable',
            transformer: (i: string) => chalk.magenta(i),
        });
    } else {
        newConfig.outDir = '/';
    }

    const options = await inquirer.checkbox({
        message:
            'The following checkboxes minutely change the inner workings of Luaver. Feel free to enable any or none.',
        choices: [
            { name: 'Disable default processors?', value: 'disableDefaultProcessors' },
            { name: 'Disable seed randomization?', value: 'dontRandomizeSeed' },
            { name: 'Include version number in plugin title?', value: 'devVersionInPluginName', checked: true },
            {
                name: "Include version number in the game's plugin list (on build only)?",
                value: 'buildVersionInPluginName',
                checked: true,
            },
        ],
        loop: true,
    });

    if (options.some(o => o.includes('VersionInPluginName'))) {
        newConfig.pluginVersion = await inquirer.input({
            message: 'Please enter the desired version number your plugin will display.',
            required: true,
            default: existingConfig.pluginVersion ?? 'v1.0.0',
            prefill: 'editable',
            transformer: (i: string) => chalk.magenta(i),
        });
    }

    let defaultSources: string[] = existingConfig.sources ?? ['plugin'];
    const sourceList = defaultSources.join(', ');

    newConfig.sources = await inquirer.input({
        message:
            "Please input a comma-separated list of folders that you'd like the plugin to take its Lua files from.",
        required: true,
        default: sourceList,
        prefill: 'editable',
        transformer: (i: string) => chalk.magenta(i),
    });

    newConfig.lineSeparator = await inquirer.select({
        message: 'Please select the line separator used in the final plugin.',
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
    });
}
try {
    main();
} catch (e) {}
