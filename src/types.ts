import { AudioPlayer} from "@discordjs/voice";
import { ChatInputCommandInteraction, Client, Collection, Message, SlashCommandBuilder } from "discord.js";

export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
}

export interface Player {
    player: AudioPlayer,
    queue: VideoMetaData[],
    loop: boolean,
    current?: VideoMetaData,
    skip: false,
    timeout?: NodeJS.Timeout
}

export interface VideoMetaData {
    name: string,
    id: string,
    url: string,
    duration: string
}

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : ChatInputCommandInteraction) => void
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    aliases: string[]
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}

export namespace Global {
    export var players: {[guildId: string]: Player}
    export var client: Client
}