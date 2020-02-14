module.exports.help = {
    name: "emotecount",
    usage: "emotecount [Messages to count (times 100)]",
    description: "Get emote and reaction count (Reserved for deep)"
}

module.exports.run = async (client, message, args) => {
    if(message.author.id !== "140649299175276545") return;  //ADMIN's ID
    console.log("Running emotecount!");
    if(!args[0]){
        message.reply("Please provide the number of messages to scan");
        return;
    }
    let limit = args[0];
    let guild = message.guild;
    let channelLength = 0;
    guild.channels.forEach((c,i) => {
        if(c.type === "text") channelLength += 1;
    });
    let scanned = 0;
    message.reply(`Scanning ${limit*100*channelLength} messages\n`);
    let statusContent = "Channels Scanned: ";
    let statusMessage = await message.channel.send(statusContent + scanned + "/" + channelLength);
    var startTime, endTime;
    startTime = new Date();   
    
    //Create Array of Emoji Objects
    var emojis = guild.emojis;
    var emojiArr = emojis.map(emoji => { 
        emoji.count = 0;
        return emoji;
    });
    
    //Get Messages and Count Emotes
    let channels = guild.channels.array();
    for(let x in channels){
        let channel = channels[x];
        if(channel.type !== "text") continue;   //Skip non-text channels
        let before = null;
        
        //Loop Through Channel messages
        for(let y = 0; y < limit; y++){
            try{
                let messages = await channel.fetchMessages({limit: 100, before: before});
                let length = messages.array().length;
                if(!messages.array()[length - 1].id) return;
                before = messages.array()[length - 1].id;
                for(let g in messages.array()){
                    let message = messages.array()[g];
                    let reactions = message.reactions.array();
                    
                    //Count Emojis
                    for (let z in emojiArr){
                        if(message.content.includes(emojiArr[z].id)){
                            emojiArr[z].count += 1;
                        }
                    }
                    
                    //Count Reactions
                    for (let g in reactions){
                        let reaction = reactions[g];
                        let id = reaction.emoji.id;
                        for(let u in emojiArr){
                            if(emojiArr[u].id === id){
                                emojiArr[u].count += reaction.count; 
                            }                           
                        }
                    }
                } 
            }catch(e){
                console.log(e.stack);
            }
        }
        scanned += 1;
        await statusMessage.edit(statusContent + scanned + "/" + channelLength);
        
    }
    
    //Sort Emojis by Count (Descending)
    emojiArr.sort(function(a,b){
        return b.count - a.count;
    });
    
    //Send Counts to Channel
    let sendMessage = "";
    emojiArr.forEach((emoji,i) => {
        sendMessage += `${emoji} ${emoji.count}\n`;
    });
    message.channel.send(sendMessage);
    
    //Calculate time taken and send to channel
    endTime = new Date();
    var diff = (endTime - startTime) / 1000;
    var seconds = Math.round(diff);
    message.channel.send("Time Taken: " + seconds + " seconds");
    
}
