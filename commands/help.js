module.exports.help = {
    name: "help",
    usage: "help",
    description: "See command list for Wumbot"
}

module.exports.run = (client, message, args) => {
    //Sort Commands Alphabetically
    client.commands.sort( function(a,b){
        if(a.help.name < b.help.name) { return -1;}
        if(a.help.name > b.help.name) { return 1;}
        return 0;
    });
    
    let sendMessage = "";
    client.commands.forEach((command,iteration) => {
        sendMessage += `\nname: \t**${command.help.name}**`;
        sendMessage += `\tusage: \t**${command.help.usage}**`;
        sendMessage += `\ndescription: \t${command.help.description}\n`;
    });
    message.channel.send(sendMessage);
}
