const { readdir } = require("fs");

module.exports = (client) => {
  readdir("./events/", (err, files) => {
      if(err) return console.error(err);   
      let jsfilesArr = files.filter(f => f.split(".").pop() === "js");
      if(jsfilesArr.length <= 0){
          console.log("There are no events!");
          return;
      }
      
      console.log(`\nLoading ${jsfilesArr.length} events!`);
      
      jsfilesArr.forEach((f,i) => {
          let prop = require(`../events/${f}`);
          console.log(`${i}: ${f} Loaded!`);
          let eName = f.split(".")[0];
          client.on(eName, prop.bind(null,client));
          delete require.cache[require.resolve(`../events/${f}`)];
      });
  });
}
