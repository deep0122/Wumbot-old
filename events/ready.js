module.exports = async (client, message, args) => {
        console.log(`Logged in as ${client.user.username}`); 
        client.user.setActivity("Hoes Mad", { type: "PLAYING" });
}
