const { readdir } = require("fs");

module.exports = (client) => {
  readdir("./commands/", (err, files) => {
      if(err) return console.error(err);   
      let jsfilesArr = files.filter(f => f.split(".").pop() === "js");
      if(jsfilesArr.length <= 0){
          console.log("There are no commands!");
          return;
      }
      
      console.log(`\nLoading ${jsfilesArr.length} commands!`);
      
      jsfilesArr.forEach((f,i) => {
          let prop = require(`../commands/${f}`);
          console.log(`${i}: ${f} Loaded!`);
          client.commands.set(prop.help.name, prop);
      });
  });
}
