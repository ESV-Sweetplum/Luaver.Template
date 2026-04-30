import * as inquirer from '@inquirer/prompts';
import LuaverConfig from '../../Luaver/src/interfaces/luaverConfig';
import chalk from 'chalk';
import * as json5 from 'json5';
import * as fs from 'fs';

export default async function main() {
    let existingConfig: Partial<LuaverConfig> = {};
    if (fs.existsSync('luaverConfig.json5')) {
        existingConfig = json5.parse(fs.readFileSync('luaverConfig.json5', 'utf-8'));
    }

    const pluginName = await inquirer.input({
        message: 'Please enter a name for your plugin.',
        default: existingConfig.pluginName,
        transformer: (i: string) => chalk.magenta(i),
    });
}
try {
    main();
} catch (e) {}
