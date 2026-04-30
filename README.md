# Luaver.Template

###### Latest Release: May 1, 2026

> [!IMPORTANT]
> This template repository is primarily for developers. For the plugin that creates SVs in Quaver, please refer to [plumoguSV](https://github.com/ESV-Sweetplum/plumoguSV).

This batteries-included, opinionated template repository is meant to help developers create their own plugins in [Quaver](https://github.com/Quaver/Quaver), using the [Luaver](https://github.com/ESV-Sweetplum/Luaver) framework. The primary advantages of using this Luaver template over a single `plugin.lua` file are numerous:

- Luaver supports a multi-folder structure, and automatically transpiles all Lua sources down to one plugin file (with some minor improvements).
- Built-in intellisense allows developers to significantly speed up their development times, meaning less documentation reading and more code writing.
- The [QParcel](https://github.com/ESV-Sweetplum/QParcel) package included in this template carries many useful helper functions that provide additional functionality to the base Quaver API.

Best for medium/large-scale projects and plugin hubs, this Luaver template is a practical necessity for developers and enthusiasts alike.

## Informational Video

If you want to get started but don't like reading, please watch the following video on creating your own plugin with this template.

\<TO BE DONE LATER\>

## Installation, Setup and Usage

To use this template to create a plugin of your own, follow the installation steps below:

1. Either click the green "use this template" button at the top right and follow the instructions, or clone this repository using the command `git clone --recurse-submodules https://github.com/ESV-Sweetplum/Luaver.Template <OUTPUT_DIRECTORY>`.
    - If you use this template via the GitHub website, make sure to clone the new repository onto your machine.
2. If you don't have it already, install [Node.JS](https://nodejs.org/en).
3. Install the internal dependencies by running `npm i` in a terminal set to the root of your plugin.
4. Run the setup script via `npm run setup` and follow the setup instructions.
5. Run `npm run dev` in the terminal, which will start the watcher. Now, every time you make a change to the `plugin` folder, your plugin will automatically update in Quaver.

## Basic Info

If you're already familiar with the basics of Quaver plugin programming, you can skim through this section.

- Typically, Quaver plugins run code through two functions; the `awake()` function, which is ran when the plugin is enabled for the first time (in the given editor session), and the `draw()` function, which runs on every frame.
    - In Luaver, these correspond to the `_awake.lua` and `_draw.lua` files. All code you put inside these files will be treated as awakening/draw code.
- All other code should be run through these two functions; that is, code that should run every frame (for rendering, computation, etc.) should only ever be called within the draw function, or by a function that recursively ends at the draw function.
    - If so desired, you can split the `_draw.lua` file into multiple files by appending a file with the `.draw.lua` extension, which will place the given code at the end of the draw function. If you'd like it to place the code at the beginning, you can use the secondary extension `.precurse.draw.lua`. The same applies for the `_awake.lua` function.
- Aside from the `_draw.lua` and `_awake.lua` files, all other `.lua` files will not have an implicit function header added to them. See the included `plugin` folder for more details.
    - Note that extraneous files with double extensions (`.draw.`, `.awake.`) also do not require a global function header, unless defining a function within the `draw/awake` function itself.

## Template Features

Ensure you have run the installation and setup scripts correctly by following the instructions above. Note that the standard Luaver config, denoted by `luaverConfig.json5`, is not present in the root of this template until you run the setup script.

1. To include any of your own packages or scripts, add their path or their directory to the `sources` list in your `luaverConfig.json5` file. All other configuration options can be controlled from here as well.
2. Extra TypeScript modules can be added via the `modules` folder, useful for storing/compiling data or running scripts that would otherwise not be possible to do in Quaver. When adding a folder into the modules folder, you can call its index script by running `npm run compile` and `node dist/modules/<YOUR_MODULE>`. Optionally, you can add an npm script to simplify the above process into one command. See the setup script in `package.json` for context.
3. Some data from the `luaverConfig.json5` file will be passed into your plugin via exposed globals. For more information about this, visit the [`Luaver`](https://github.com/ESV-Sweetplum/Luaver) repository.
4. `settings.ini` and other related plugin files (such as workshop data) will automatically be bundled on compile, meaning you only have to fill out the information once in the `luaverConfig.json5` file.
5. You can add your own TypeScript processors via the `externalProcessors` list in the `luaverConfig.json5` file. As long as they export a default function which transforms a string/string array, `Luaver` will automatically recognize it.
    - Note that processors come in two forms, file processors and plugin processors. File processors run on files and plugin processors run on the end result. To specify the type of processor you're running, append the `.file.ts` or the `.plugin.ts` extension to all processors in your processors folder.

## Support

If you want any custom features or rush orders, check out the link below.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X11IU1C3)

To ask for help, or to request anything plugin-related, please join the [Discord](https://discord.gg/gU4P5nPAMF)!
