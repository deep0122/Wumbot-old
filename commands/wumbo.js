module.exports.help = {
    name: "wumbo",
    usage: "wumbo [ 1 | 2 ]",
    description: "THE PURGE IS COMING"
}

module.exports.run = (client, message, args) => {
    if(!args[0]){
        message.reply("Provide a number");
        return;
    }
    if(args[0] == "1"){
        message.channel.send({
            files: [{
                attachment: './images/snap.png',
                name: 'snap.png'
            }]
        })
    }else if(args[0] == "2"){
        message.channel.send({
            files: [{
                attachment: './images/asianmang.jpg',
                name: 'asianmang.jpg'
            }]
        })
    }
}
