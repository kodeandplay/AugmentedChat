Here is my implementation of a real time chat application. The basis of this 
application comes from the tutorial provide at http://socket.io/get-started/chat/. If you complete the tutorial there are several features 'assigned' as homework which I 
decideded to implement.

1) An announecment is broadcast to all connected users of any current user entering/departing. In other words, the application listens for connections/disconnections and makes an announcement accordingly.

2) A sidebar lists all other users as well as the current user. With any arrival/departure of a user the list is automatically updated.

3) Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter. This feature is added to my implementation using: socket.broadcast.emit('event', data) -- as opposed to -- io.emit('event', data) which would announce the event to every connected user.

4) The ability to private message is added by clicking on the sidebar of the user you would like to engage in a private message session with. Every message you send afterwards will/should only be recieved by that particular user. You will still recieve all
public messages. To disengage from the private message session you must click on your own username and that will end your private session and reinstate your public session.
The recipient of the private message will have '(whisper)' appended to the sender
username in order to indicate the difference between a public/private message.

Soon to follow, I may implement the "{user} is typing" functionality shortly. Only time will tell.


