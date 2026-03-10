const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger');

/**
 * Command Registry - auto-discover dan register semua commands
 */
class CommandRegistry {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
    }

    /**
     * Load semua commands dari sub-folders
     */
    loadCommands() {
        const commandsDir = __dirname;
        const categories = fs.readdirSync(commandsDir).filter(item => {
            const fullPath = path.join(commandsDir, item);
            return fs.statSync(fullPath).isDirectory();
        });

        for (const category of categories) {
            const categoryPath = path.join(commandsDir, category);
            const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

            for (const file of files) {
                try {
                    const command = require(path.join(categoryPath, file));

                    if (!command.name || !command.execute) {
                        Logger.warn(`Command ${file} tidak punya name atau execute, skip.`);
                        continue;
                    }

                    this.commands.set(command.name, command);

                    // Register aliases
                    if (command.aliases && Array.isArray(command.aliases)) {
                        for (const alias of command.aliases) {
                            this.aliases.set(alias, command.name);
                        }
                    }

                    Logger.debug(`Command loaded: ${command.name} (${category})`);
                } catch (error) {
                    Logger.error(`Gagal load command ${file}:`, error.message);
                }
            }
        }

        Logger.success(`${this.commands.size} commands loaded.`);
    }

    /**
     * Ambil command by name atau alias
     */
    getCommand(name) {
        // Cek langsung
        if (this.commands.has(name)) {
            return this.commands.get(name);
        }

        // Cek alias
        const aliasTarget = this.aliases.get(name);
        if (aliasTarget) {
            return this.commands.get(aliasTarget);
        }

        return null;
    }

    /**
     * Ambil semua commands (untuk help menu)
     */
    getAllCommands() {
        return this.commands;
    }
}

// Singleton
const registry = new CommandRegistry();

module.exports = registry;
