const http = require("https");
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
//const joinWaitTime = 20000;  //Time to wait for people to join the game
//const answerWaitTime = 20000; //Time to wait for each answer
const joinWaitTime = 10000;  //Time to wait for people to join the game
const answerWaitTime = 10000; //Time to wait for each answer
const questionLimit = 3;
const url ="https://opentdb.com/api.php?amount=" + questionLimit + "&category=9"; //general knowledge category

module.exports.help = {
  name: "trivia",
  usage: "trivia",
  description: "trivia"
}

module.exports.run = async (client, message, args) => {
  let response = await retrieveData(url);
  getUsers(client,message).then((users) => {
    trivia(client, message, response, users).then((users) => {
      console.log("FINISHED");
      users.forEach((user,item) => {
        message.channel.send(user.username + ": " + user.score + "/" + questionLimit);
      });
    }).catch(console.error);
  }).catch(console.error);
}

function getUsers(client,message){
  return new Promise((resolve, reject) => {
    let randomEmoji = client.emojis.random();
    let filter = (reaction, user) => reaction.emoji === randomEmoji;
    let users = null;
    message.channel.send("Upvote this reaction to join. Game will start in 30 seconds.")
    .then(async (msg)=>{
      msg.awaitReactions(filter, { time: joinWaitTime})
      .then(async collected => {
        try{
          users = collected.first().message.reactions.first().users.filter(user => user !== client.user);
        }catch(error){
          //return console.error(error);
          reject(Error(error));
        }
        //return(users);
        users.forEach((user, index) => {
          user.score = 0;
        });
        resolve(users);
      }).catch(err => console.error(err));
      await msg.react(randomEmoji);
    }).catch(err => console.error(err));
  });
}

function retrieveData(url){
  return new Promise((resolve, reject) => {
    let body = "";
    http.get(url, (res) => {
      var body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        var response = JSON.parse(body);
        resolve(response);
        //return(response);
      });
    }).on('error', (err) => {
      console.log("Error: ", err);
      reject(Error("Error getting questions"));
      //return console.error(err);
    });
  });
}

function trivia(client, message, body, users){
  return new Promise(async (resolve, reject) => {
    let results = body.results;
    let filter = (reaction, user) => { 
      if(["🇦","🇧","🇨","🇩"].includes(reaction.emoji.name)){
        if(users.array().includes(user)){
          //console.log("YES");
          return true;
        }
      }else{
        //console.log("NO");
        return false;
      }
    };
    console.log(results);
    for(let x in results){
      let question = results[x].question;
      let answers = results[x].incorrect_answers;
      let correct = results[x].correct_answer;
      answers.push(correct);
      answers.sort((a,b) => 0.5 - Math.random()); //Shuffle the array

      let correct_index = answers.findIndex((elem) => elem == correct);
      let qNum = Number(x)+1;
      let output = "```" + qNum + ": " + entities.decode(question) + "\n\n";
      answers.forEach((elem, index) => {
        output += String.fromCharCode(65+(index)) + ": " + entities.decode(elem) + "\n";
      });
      output += "```";
      message.channel.send(correct);
      await message.channel.send(output)
        .then(async (msg) => {
          if(answers.length == 4){
            await msg.react("🇦");
            await msg.react("🇧");
            await msg.react("🇨");
            await msg.react("🇩");
          }else{
            await msg.react("🇦");
            await msg.react("🇧");
          }
          await msg.awaitReactions(filter, { time: answerWaitTime})
            .then(collected => {
              //console.log(collected);
		          //message.channel.send(correct);
              return collected;
            }).then((userAnswers) => {
              users.forEach((user,index) => {
                let usrAns = [];
                //Get Which Anwers the USER put
                userAnswers.array().forEach((msgReaction, index) => {
                  if(msgReaction.users.array().indexOf(user)){
                    switch(msgReaction._emoji.name){
                      case "🇦":
                        usrAns.push(0);
                        break;
                      case "🇧":
                        usrAns.push(1);
                        break;
                      case "🇨":
                        usrAns.push(2);
                        break;
                      case "🇩":
                        usrAns.push(3);
                        break;
                    }
                  }
                });

                //Randomize answers if more than one selected
                if(usrAns.length > 1){
                  usrAns = [usrAns[Math.floor(Math.random()*usrAns.length)]];
                }

                if(usrAns.includes(correct_index)){
                  console.log("Correct" + user.username);
                  user.score += 1;
                }
                
              });
              return users;
            }).catch(console.error);
        }).catch(console.error);

      //message.channel.send("```" + entities.decode(question) + "\n" + answers + "```");
      if(results[results.length-1] == results[x]){
        resolve(users);
      }
    }
  });
}
