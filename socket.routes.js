export const routes = (socket, io) => {
    socket.emit('welcome')

    socket.on('message', async(msg) => {
        const xssStrings = [
            '<script>',
            'onload=',
            'onhover=',
            '</script>',
        ]

        if (xssStrings.some((e) => msg.body.includes(e))) {
            socket.emit('flag', { id: '952519c3-a0e9-45df-a033-06ff6ce49932' })
        } else {
            io.emit('message', msg)
        }
    })

    socket.on('registered flag', (data) => {
        io.emit('flag found', data)
    })

    socket.on('registration', (user) => {
        io.emit('registration', user)
    })

}