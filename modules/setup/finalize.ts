import { exec } from 'child_process';
import * as fs from 'fs';
import * as json5 from 'json5';

/**
 * The function ran after the setup is finalized, simple or explicit.
 * @param newConfig The configuration to put into `luaverConfig.json5`.
 */
export default function finalizeSetup(newConfig: Record<string, any>) {
    fs.writeFileSync(
        'luaverConfig.json5',
        json5.stringify(newConfig, { quote: '"', space: 4 }),
    );
    fs.rmSync('.git', {
        recursive: true,
        force: true,
        maxRetries: 1000,
        retryDelay: 10,
    });

    const existingPackage = JSON.parse(
        fs.readFileSync('package.json', 'utf-8'),
    );
    existingPackage.name = lintPluginName(newConfig.pluginName as string);
    existingPackage.version = newConfig.pluginVersion;
    existingPackage.author = newConfig.pluginAuthor;
    if (newConfig.description)
        existingPackage.description = newConfig.description;

    fs.writeFileSync('package.json', JSON.stringify(existingPackage, null, 4));

    // Regenerates package-lock to include new data from above.

    fs.rmSync('package-lock.json');
    exec('npm i --package-lock-only', err => {
        if (err) throw new Error(err.message);
    });
}

function lintPluginName(str: string) {
    return str.toLowerCase().replaceAll(/[^a-z.~_-]/g, '');
}
