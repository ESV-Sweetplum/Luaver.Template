# Luaver.Template

###### Latest Release: May 1, 2026

> [!IMPORTANT]
> This template repository is primarily for developers. For the plugin that creates SVs in Quaver, please refer to [plumoguSV](https://github.com/ESV-Sweetplum/plumoguSV).

This template repository is meant to help developers create their own plugins in [Quaver](https://github.com/Quaver/Quaver), using the [Luaver](https://github.com/ESV-Sweetplum/Luaver) framework. The primary advantages of using this Luaver template over a single `plugin.lua` file are numerous:

- Luaver supports a multi-folder structure, and automatically transpiles all Lua sources down to one plugin file (with some minor improvements).
- Built-in intellisense allows developers to significantly speed up their development times, meaning less documentation reading and more code writing.
- The [`QParcel`](https://github.com/ESV-Sweetplum/QParcel) package included in this template carries many useful helper functions that provide additional functionality to the base Quaver API.

Best for medium/large-scale projects and plugin hubs, this Luaver template is a practical necessity for developers and enthusiasts alike.

## Usage

To use this template to create a plugin of your own, follow the installation steps below:

1. Either click the green "use this template" button at the top right and follow the instructions, or clone this repository using the command `git clone --recurse-submodules https://github.com/ESV-Sweetplum/Luaver.Template <DIRECTORY_NAME>`.
    - If you use this template via the GitHub website, make sure to clone the new repository onto your machine.
2. If you don't have it already, install [`Node.JS`](https://nodejs.org/en).
3. Install the internal dependencies by running `npm i` in a terminal set to the root of your plugin.
4. Run the setup script via `npm run setup` and follow the setup instructions.
5. Run `npm run dev` in the terminal, which will start the watcher. Now, every time you make a change to the `plugin` folder, your plugin will automatically update in Quaver.

## Support

If you want any custom features or rush orders, check out the link below.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X11IU1C3)

To ask for help, or to request anything plugin-related, please join the [Discord](https://discord.gg/gU4P5nPAMF)!
