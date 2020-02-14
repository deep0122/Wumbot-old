module.exports.help = {
    name: "yasin",
    usage: "yasin",
    description: "WOAHWOAHWOAH"
}

module.exports.run = (client, message, args) => {
    
    message.channel.send({
        files: [{
            attachment: './images/whoa.png',
            name: 'whoawhoawhoa.png'
        }]
    })
    .then()
    .catch(console.error);
}
