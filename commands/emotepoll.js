module.exports = {
  help: {
    name: "emotepoll",
    usage: "emotepoll [Attach Emote Image Here]",
    description: "UNUSABLE. Start a poll for a emote to be added [might remove]"
  },
  
  run: async (client, message, args) => {
      if(!message.attachments.first()) {
          message.reply("Attach emote image with command!") 
          return;
      }
      
      if(message.attachments.first().filesize >= 256000){
          await message.reply("Image must be under 256kb!");
      }
      
      // message.attachments.forEach(c,i) => {
      //     await message.channel.send(c);
      // }
    }
}
