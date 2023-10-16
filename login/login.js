const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const User = require('./models/user');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Comando para pedir el correo electrónico al usuario
bot.command('login', (ctx) => {
    ctx.reply('Por favor, ingresa tu correo electrónico:');
    // Guardamos el comando que se está ejecutando para futuras referencias.
    ctx.session.command = 'login';
});

// Manejador de texto para el correo electrónico
bot.on('text', async (ctx) => {
    const { command } = ctx.session;

    if (command === 'login') {
        const userEmail = ctx.message.text;
        // Buscamos el correo en la base de datos.
        const user = await User.findOne({ email: userEmail });

        if (user) {
            // El correo existe en la base de datos. Aquí puedes continuar con la autenticación.
            // Por ejemplo, podrías generar y enviar un código de seguridad al correo del usuario.
            // Luego, verifica ese código cuando el usuario lo ingrese.
            ctx.reply('Correo válido. Ahora verifica tu correo para continuar.');

            // Puedes guardar el correo del usuario en la sesión si lo necesitas más adelante.
            ctx.session.userEmail = userEmail;
        } else {
            ctx.reply('Correo no válido. Por favor, verifica el correo ingresado.');
        }

        // Eliminamos el comando de la sesión.
        delete ctx.session.command;
    }
});

bot.launch();
