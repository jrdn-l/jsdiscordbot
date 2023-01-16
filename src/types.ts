import { AudioPlayer} from "@discordjs/voice";
import { Interaction, Client, Collection, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
export interface Player {
    player: AudioPlayer,
    queue: VideoMetaData[],
    loop: boolean,
    current?: VideoMetaData,
    skip: boolean,
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
    execute: (interaction : Interaction) => void
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    aliases: string[]
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>,
        cooldowns: Collection<string, number>
    }
}