import { Assets } from "../../../core/handlers/assets.js";
import { loadPlugins } from "../../../core/var/modules/loader.js";
import {isExists, createDir} from "../../../core/var/utils.js";
const __dirname = import.meta.dirname;
import fs from "fs";

const config = {
    name: "plugins",
    aliases: ["pl", "plg", "plugin"],
    description: "Manage plugins",
    usage: "[reload]/[list]/[install]",
    permissions: [2],
    credits: "Install by Renz Mansueto",
};

const langData = {
    en_US: {
        "result.reload": "Reloaded plugins, check console for more details",
        "result.list":
            "Commands: {commands}\nEvents: {events}\nOnMessage: {onMessage}\nCustoms: {customs}",
        "result.installed":
            "✅ | Plugin installed successfully!",
        "invalid.query": "Invalid query!",
        "error.unknow": "An error occurred, check console for more details",
    },
};


async function onCall({ message, args, getLang, xDB: xDatabase }) {
    async function reload() {
    global.plugins.commands.clear();
            global.plugins.commandsAliases.clear();
            global.plugins.commandsConfig.clear();
            global.plugins.customs = 0;
            global.plugins.events.clear();
            global.plugins.onMessage.clear();

            for (const lang in global.data.langPlugin) {
                for (const plugin in global.data.langPlugin[lang]) {
                    if (plugin == config.name) continue;
                    delete global.data.langPlugin[lang][plugin];
                }
            }

            delete global.data.temps;
            global.data.temps = new Array();

            
    }
    try {
        const query = args[0]?.toLowerCase();
        if (query === "reload") {
            reload()

            await loadPlugins(xDatabase, Assets.gI());
            return message.reply(getLang("result.reload"));
        } else if (query == "list") {
            return message.reply(
                getLang("result.list", {
                    commands: global.plugins.commands.size,
                    events: global.plugins.events.size,
                    onMessage: global.plugins.onMessage.size,
                    customs: global.plugins.customs,
                })
            );
        } else if(query === "install") {
          const path = "/opt/render/project/src"
            if(!args[1].endsWith("js")) {
                return message.reply("No file name provided.");   }
            const prov = args.slice(2)?.join(" ").split("dir")
            const code = prov[0];
            const folderName = prov[1].trim();
            
       if(!isExists(path + "/plugins/commands/" + folderName)) { createDir(path + "/plugins/commands/" + folderName);    
       }  
       fs.writeFileSync(`${path}/plugins/commands/${folderName}/${args[1]}`, code)
          reload()  
            await loadPlugins(xDatabase, global.plugins);
        return message.reply(getLang("result.installed"));
        }
        else {
            message.reply(getLang("invalid.query"));
        }
    } catch (e) {
        console.error(e);
        message.reply(getLang("error.unknow"));
    }
}

export default {
    config,
    langData,
    onCall,
};
