const http = require("http");
const { parseString } = require("xml2js");
const Discord = require("discord.js");  // Discord
const { prefix, WA_AppID } = require("../settings.json");    // Token and Pref

module.exports = async (client, message, args) => {
  if(message.author.bot) return;  //Return if author is a bot
  if(message.channel.type === "dm") return;

  //ELIMINATE THE UWU
  let reLst = [
      /(u|U)(\s*)(w|W)(\s*)(u|U)/,
      /(U)(.*)( +)(W)(.*)( +)(U)(.*)/,
      /(u|U|C|c)(\n)(W|w|e|E)(\n)(U|u|C|c)/
    ];
    
  for(let item of reLst){
    if(message.content.match(item)){
      message.channel.send({
          files: [{
              attachment: './images/nouwu.jpg',
              name: 'nouwu.jpg'
          }]
      }).catch(console.error);
      break;
    }
  }

  //Bot Mention. Wolfram Alpha
  if(message.isMemberMentioned(client.user)){
    let content = message.content.split(" ").filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg)).join(" ");
    let url = "http://api.wolframalpha.com/v2/query?input="+content+"&appid=" + WA_AppID;
    let body = "";

    http.get(url, (res) => {
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        parseString(body, (err, result) => {
          let c = "";
          try{
            c = result['queryresult']['pod']['1']['subpod']['0'];
          }catch(e){
            message.reply("i no understand");
            return;
          }
          if(String(c['plaintext'])){
            message.reply(String(c['plaintext']));
          }else if(String(c['img']["0"]["$"]["src"])){
            let imgUrl = String(c['img']["0"]["$"]["src"]);
            if(imgUrl.includes("gif")){
              imgUrl = imgUrl + ".gif";
            }else if(imgUrl.includes("jpeg")){
              imgUrl = imgUrl + ".jpeg";
            }
            console.log(imgUrl);
            let attachment = new Discord.Attachment(imgUrl);
            message.reply(attachment);
          }else{
            message.reply("i no understand");
          }
        });
      });
    }).on('error', (err) => {
      console.log("Error: ", err);
    });
  }

  let msgArr = message.content.split(" "); //Message Content Array
  let command = msgArr[0];    //Command with prefix
  let argsArr = msgArr.slice(1);    //Arguments Array

  if(!command.startsWith(prefix)) return; //Doesn't match our prefix

  let cmd = client.commands.get(command.slice(prefix.length));
  if(cmd) cmd.run(client, message, argsArr);
}  
