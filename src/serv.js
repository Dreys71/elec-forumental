const cors = require('cors');
const axios = require('axios');
var app = require('express')();
app.use(cors({credentials: true, origin: "*"}));
var http = require('http').Server(app);
var io = require('socket.io')(http);
const api = "http://localhost:8000";

io.origins(['http://localhost:8080', api]); //TODO : Change by localhost


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('update last chat view', function (data) {
        let config = {
            headers: {
                'Authorization': data.token,
                'Content-type': 'application/x-www-form-urlencoded',
                'Accepted': 'application/json'
            }
        };
        let requ = {
           sender: data.from
        };
        axios.post(api + '/api/message/view/update', requ, config)
    });

    socket.on('send_message', (data) => {
        if (data.message && data.author && data.to && data.token) {
            let temp_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
            io.in("personal-user-" + data.author.id).emit('receipt_message', {
                "to": data.to,
                "message": {
                    content: data.message,
                    created_at: new Date(),
                    updated_at: new Date(),
                    sender: data.author.id,
                    temp_id: temp_id
                }
            });
            io.in("personal-user-" + data.to).emit('receipt_message', {
                "from": data.author,
                "message": {
                    content: data.message,
                    created_at: new Date(),
                    updated_at: new Date(),
                    sender: data.author.id,
                    temp_id: temp_id
                }
            });
            let config = {
                headers: {
                    'Authorization': data.token,
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Accepted': 'application/json'
                }
            };
            let requ = {
                type: "user",
                recever_user: data.to,
                msg_data: data.message,
                recever_forum: 0
            };
            axios.post(api + '/api/message/new', requ, config
            ).then(response => {

                io.in("personal-user-" + data.author.id).emit('receipt_message_id', {
                    "key": parseInt(data.to),
                    "temp_id": temp_id,
                    "true_id": response.data.message_id
                });
                io.in("personal-user-" + data.to).emit('receipt_message_id', {
                    "key": parseInt(data.author.id),
                    "temp_id": temp_id,
                    "true_id": response.data.message_id
                });

            }).catch(error => {
                io.in("personal-user-" + data.author.id).emit("error", {"content": "Impossible d'envoyer le message en base de donnée : " + error.response.data.message});
            });


        }
        else {
            io.in("user-" + data.author.id).emit("error", {"content": "Impossible d'envoyer le message"});
        }

    });
    socket.on('subscribe', function(room) {
        socket.join(room);
    });
    socket.on('USER_ONLINE',function (id) {
        io.in("user-" + id).emit("re-online",id);
    });
    socket.on('online', function(request) {
        if(request.room && request.data){
            io.in(request.room).emit("user", request.data);
            io.in(request.room).emit("online", request);
        }
        else {
            io.emit("online", request);
        }
    });
    socket.on('update my profile picture', function(data){
        console.log('FRIEND UPLOAD IMAGE', data.id)
        io.in("user-" + data.id).emit("new_profile_picture", data);
    });
});
io.on('disconnect',function () {

});


http.listen(8070, function(){
    console.log('listening on *:8070');
});
