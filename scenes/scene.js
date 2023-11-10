const mongoose = require('mongoose');
const { Telegraf, session, Scenes: { WizardScene, Stage } } = require('telegraf');
const nodemailer = require('nodemailer');
const User = require('../models/users');
const Course = require('../models/courses');
const Grades = require('../models/grades');
const { getDollarPrices } = require('venecodollar');
const { PagoMovil } = require('../models/payments');
require('dotenv').config();

// Login Wizard Scene
const login = new WizardScene(
    'my-login',
    async ctx => {
        await ctx.reply('Por favor ingresa tu email:');
        // Abro un espacio en memoria como objeto para posteriormente guardar el email.
        ctx.wizard.state.data = {};
        // Paso a la siguiente escena.
        return ctx.wizard.next();
    },
    async ctx => {
        // Aqui guardo el email del mensaje del usuario.
        ctx.wizard.state.data.email = ctx.message?.text;
        // Compruebo con expresion regular si verdaderamente es un email y no cualquier otro texto
        const EMAILREGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const emailValidation = EMAILREGEX.test(ctx.wizard.state.data.email);
        // De no ser un email, cierro la escena.
        if (!emailValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZA5lRY2LGfawNgGmyJba0uY9eAkHwwACWQADUomRI5_hf3uttGWoMwQ');
            await ctx.reply('Eso no es un email');
            // Salgo de la escena
            return ctx.scene.leave();
        }
        // Consulto a la base de datos para buscar el usuario por correo electrónico
        const user = await User.findOne({ email: ctx.wizard.state.data.email });
        // Consulto tambien que curso esta estudiando y sus notas
        const userCourse = await Course.findOne({ _id: user?.studying });
        const userGrade = await Grades.find({ user: user?._id });
        // Consulto si el usuario esta verificado (logueado) o no.
        const verified = user?.verified;
        // Guardo la info del usuario para usarla luego.
        ctx.wizard.state.data.user = user;
        ctx.wizard.state.data.userCourse = userCourse;
        ctx.wizard.state.data.userGrade = userGrade;
        ctx.wizard.state.data.verified = verified;
        ctx.wizard.state.data.grades = [];
        ctx.wizard.state.data.grade = 0;
        if (!user) {
            // El correo no existe en la base de datos.
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZBJlRY-oHk-8ktm0jVsC66GCva6s1wACuQ4AAmxu8Emp2F_Xn3emBjME');
            await ctx.reply('Correo no encontrado en la base de datos. Recuerda que debes estar cursando el primer módulo o superior para asignarte tu usuario de EDTécnica.');
            return ctx.scene.leave();
        } else if (!verified) {
            // Creamos un número aleatorio de 6 dígitos que será su clave temporal para iniciar sesión.
            const temporalPass = Math.floor(Math.random() * 900000) + 100000;
            console.log(temporalPass);
            ctx.wizard.state.data.temporalPass = temporalPass;
            // Al no estar verificado, le enviamos un correo con su clave temporal.
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: ctx.wizard.state.data.email,
                    subject: 'Clave temporal EDT Bot',
                    html: `Código de verificacion es: <b> ${temporalPass} </b>` });
            } catch (error) {
                console.log(error);
            }

            await ctx.reply(`${user.name}, ingresa el código que fue enviado a tu correo:`);
            return ctx.wizard.next();
        } else if (user && verified) {
            global.login = ctx.wizard.state.data;
            // Agrego sus modulos y notas a las variables correspondidas.
            for (let i = 0; i < ctx.wizard.state.data.userGrade.length; i++) {
                ctx.wizard.state.data.grades.push(`✯ Módulo ${ctx.wizard.state.data.userGrade[i].module}, calificación: ${ctx.wizard.state.data.userGrade[i].grade}/20`);
                ctx.wizard.state.data.grade += ctx.wizard.state.data.userGrade[i].grade;
            }
            const info = (`
            Bienvenido <b>${ctx.wizard.state.data.user.name}</b> 👋
            
<u>Información del Estudiante: </u>
            
🎓 Cursando: ${ctx.wizard.state.data.userCourse.name}
🌐 Modalidad: ${ctx.wizard.state.data.userCourse.modality}
            
📖 Módulo actual: ${ctx.wizard.state.data.user.module}/${ctx.wizard.state.data.userCourse.modules}
📊 Asistencia: ${ctx.wizard.state.data.user.attendance}%

${ctx.wizard.state.data.grades.join(' \n')}

🏆 Actual promedio de notas: ${(ctx.wizard.state.data.grade / ctx.wizard.state.data.user.module).toFixed(0)}
📝 Nota final hasta ahora: ${(ctx.wizard.state.data.grade / ctx.wizard.state.data.userCourse.modules).toFixed(0)}
            
🗓️ Próximo pago: ${ctx.wizard.state.data.user.payday.toLocaleDateString()}
💲 Monto de mensualidad: ${ctx.wizard.state.data.userCourse.module_price}$
`);
            await ctx.replyWithHTML(info,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Cerrar sesión 🔒', callback_data: 'cerrar_sesion' }, { text: 'Pagar módulo 💸', callback_data: 'pagar_modulo' }],
                        ],
                    },
                },
            );

            return ctx.scene.leave();
        }
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.wizard.state.data.code = ctx.message?.text;
        // Hago una comparación superficial utilizando el código enviado al correo.
        if (ctx.wizard.state.data.code != ctx.wizard.state.data.temporalPass) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZBplRZBNdqpNrI74ZhhZKQobfuIfPAACTgADr8ZRGvFh67KaK5_kMwQ');
            await ctx.reply('Alto ahi! el codigo ingresado no es válido, intenta loguearte mas tarde.');
            return ctx.scene.leave();
        } else if (ctx.wizard.state.data.code == ctx.wizard.state.data.temporalPass) {
            // Verifico al usuario pe causa.
            await User.findByIdAndUpdate(ctx.wizard.state.data.user._id, { verified: true });
            // Agrego sus modulos y notas a las variables correspondidas.
            for (let i = 0; i < ctx.wizard.state.data.userGrade.length; i++) {
                ctx.wizard.state.data.grades.push(`✯ Módulo ${ctx.wizard.state.data.userGrade[i].module}, calificación: ${ctx.wizard.state.data.userGrade[i].grade}/20`);
                ctx.wizard.state.data.grade += ctx.wizard.state.data.userGrade[i].grade;
            }
            const info = (`
            Bienvenido <b>${ctx.wizard.state.data.user.name}</b> 👋
            
<u>Información del Estudiante: </u>
            
🎓 Cursando: ${ctx.wizard.state.data.userCourse.name}
🌐 Modalidad: ${ctx.wizard.state.data.userCourse.modality}
            
📖 Módulo actual: ${ctx.wizard.state.data.user.module}/${ctx.wizard.state.data.userCourse.modules}
📊 Asistencia: ${ctx.wizard.state.data.user.attendance}%

${ctx.wizard.state.data.grades.join(' \n')}

🏆 Actual promedio de notas: ${(ctx.wizard.state.data.grade / ctx.wizard.state.data.user.module).toFixed(0)}
📝 Nota final hasta ahora: ${(ctx.wizard.state.data.grade / ctx.wizard.state.data.userCourse.modules).toFixed(0)}
            
🗓️ Próximo pago: ${ctx.wizard.state.data.user.payday.toLocaleDateString()}
💲 Monto de mensualidad: ${ctx.wizard.state.data.userCourse.module_price}$
`);
            await ctx.replyWithHTML(info,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Cerrar sesión 🔒', callback_data: 'cerrar_sesion' }, { text: 'Pagar módulo 💸', callback_data: 'pagar_modulo' }],
                        ],
                    },
                },
            );
            global.login = ctx.wizard.state.data;
            console.log(global.login);
            return ctx.scene.leave();
        }

    },
);

// Logout Wizard Scene
const logout = new WizardScene(
    'my-logout',
    async ctx => {
        // Busco por email y lo deslogueo. (verified false)
        await ctx.deleteMessage();
        await User.findOneAndUpdate({ email: global?.login?.email }, { verified: false });
        global.login = '';
        await ctx.replyWithSticker('CAACAgIAAxkBAAEnY_xlRX7oRcuZjGTRzJLv1QXd3VhMIwACSQIAAladvQoqlwydCFMhDjME');
        await ctx.reply('Sesión cerrada.');
        await ctx.scene.leave();
    },
);

// Pago movil/Transferencia Wizard Scene
const pagoMovilScene = new WizardScene(
    'my-pago-movil',
    async ctx => {
        await ctx.reply('Por favor ingresa tu email:');
        // Abro un espacio en memoria como objeto para posteriormente guardar el email.
        ctx.wizard.state.data = {};
        // Paso a la siguiente escena.
        return ctx.wizard.next();
    },
    async ctx => {
        // Aqui guardo el email del mensaje del usuario.
        ctx.wizard.state.data.email = ctx.message?.text;
        // Compruebo con expresion regular si verdaderamente es un email y no cualquier otro texto
        const EMAILREGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const emailValidation = EMAILREGEX.test(ctx.wizard.state.data.email);
        // De no ser un email, cierro la escena.
        if (!emailValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZCRlRZIqkNAMnM5fFT2zNrqPnPyK5gAC3QAD5KDOB2yVwjLQclMoMwQ');
            await ctx.reply('Eso no es un email válido');
            // Salgo de la escena
            return ctx.scene.leave();
        }
        await ctx.reply('Ingresa los cuatro últimos dígitos de la operación. Ejemplo: 8442');
        return ctx.wizard.next();
    },
    async ctx => {
        // Guardo el número de referencia.
        ctx.wizard.state.data.ref = ctx.message?.text;
        const REFREGEX = /^\d{4}$/;
        const refValidation = REFREGEX.test(ctx.wizard.state.data.ref);
        if (!refValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZChlRZK4ZxZdQ4l6rCKuV-c2lcOmzAACLwADwZxgDK-MRHjuZdGKMwQ');
            await ctx.reply('Número de operación inválida, deben ser unicamente 4 dígitos. No uses hashtags (#), puntos (.) o comas (,)');
            return ctx.scene.leave();
        }
        await ctx.replyWithHTML(`Escribe el monto que transferiste. Ejemplo: 2300

En caso de tener decimal, utilice un punto (.) para separar. Ejemplo: 2300.50`);
        // Paso a la siguiente escena.
        return ctx.wizard.next();
    },
    async ctx => {
        // Guardo el monto
        ctx.wizard.state.data.amount = ctx.message?.text;
        const AMOUNTREGEX = /^\d+(\.\d{1,2})?/;
        const amountValidation = AMOUNTREGEX.test(ctx.wizard.state.data.amount);
        if (!amountValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZCplRZNZzhcmJvOk0fp6hjzTIgiNrgACfQAD9wLIDy7JuwrdyyJJMwQ');
            await ctx.reply('Monto inválido, el formato debe ser solo números. En caso de tener cifras decimales, deben ser separadas con un punto (.) recuerda que solo son 2 cifras después del punto.');
            return ctx.scene.leave();
        }
        // Cierro la escena
        await ctx.replyWithSticker('CAACAgIAAxkBAAEnY_ZlRXwZCgqt4TXfusUiwb4LJ6-SWgACaAADwDZPE0z9PaPnxGmHMwQ');
        await ctx.reply('Procesando el pago, nos comunicaremos con usted mediante correo electrónico. Bienvenido a EDTécnica.');
        return ctx.scene.leave();
    },
);

// Pago Movil de módulos para estudiantes Wizard Scene
const pagoMovilModuleScene = new WizardScene(
    'my-pago-movil-module',
    async ctx => {
        const user = await User.findOne({ email: global?.login?.email });
        const userCourse = await Course.findOne({ _id: user?.studying });
        if (!user) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ2RlRmFO7gR28xOG39cLEeF2jg-tPAACrwADwZxgDNPvAhjBQx5TMwQ');
            await ctx.reply('Usted ha cerrado sesión. Debe volver a loguearse con /login para pagar su módulo correspondiente.');
            return ctx.scene.leave();
        }
        if (user.module === userCourse.modules) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ1tlRmA9ica7A0SjC9I5cYVu-aFKFAACMQADwZxgDMYOMqCLWnWlMwQ');
            await ctx.reply(`Felicidades, usted ya completó sus módulos!! ${user.module}/${userCourse.modules} módulos de ${userCourse.name}. Estás en tu último módulo, por lo tanto no hace falta pagar nada más.`);
            return ctx.scene.leave();
        }
        await ctx.reply('Ingresa los cuatro últimos dígitos de la operación. Ejemplo: 8442');
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    async ctx => {
        // Guardo el número de referencia.
        ctx.wizard.state.data.ref = ctx.message?.text;
        const REFREGEX = /^\d{4}$/;
        const refValidation = REFREGEX.test(ctx.wizard.state.data.ref);
        if (!refValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZChlRZK4ZxZdQ4l6rCKuV-c2lcOmzAACLwADwZxgDK-MRHjuZdGKMwQ');
            await ctx.reply('Número de operación inválida, deben ser unicamente 4 dígitos. No uses hashtags (#), puntos (.) o comas (,)');
            return ctx.scene.leave();
        }
        await ctx.replyWithHTML(`Escribe el monto que transferiste. Ejemplo: 2300

En caso de tener decimal, utilice un punto (.) para separar. Ejemplo: 2300.50`);
        // Paso a la siguiente escena.
        return ctx.wizard.next();
    },
    async ctx => {
        // Guardo el monto
        ctx.wizard.state.data.amount = ctx.message?.text;
        const AMOUNTREGEX = /^\d+(\.\d{1,2})?/;
        const amountValidation = AMOUNTREGEX.test(ctx.wizard.state.data.amount);
        if (!amountValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZCplRZNZzhcmJvOk0fp6hjzTIgiNrgACfQAD9wLIDy7JuwrdyyJJMwQ');
            await ctx.reply('Monto inválido, el formato debe ser solo números. En caso de tener cifras decimales, deben ser separadas con un punto (.) recuerda que solo son 2 cifras después del punto.');
            return ctx.scene.leave();
        }
        const newPagoMovil = new PagoMovil({
            email: global.login.email,
            course: global.login.userCourse.name,
            modality: global.login.userCourse.modality,
            module: global.login.userCourse.module,
            payday: global.login.userCourse.payday,
            module_price: global.login.userCourse.module_price,
            amount: ctx.wizard.state.data.amount,
            ref_number: ctx.wizard.state.data.ref,
            verified: false,
        });
        await newPagoMovil.save();
        await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ3NlRmac0lOpSBGuVHXf9u3PgWS9hgACBAEAAvcCyA8gD3c76avISTME');
        await ctx.reply('Procesando el pago, nos comunicaremos con usted a la brevedad posible.');
        return ctx.scene.leave();
    },
);

const stage = new Stage([login, pagoMovilScene, logout, pagoMovilModuleScene]);
const bot = new Telegraf(process.env.BOT_TOKEN);

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectó a mongodb');
    } catch (error) {
        console.error(error);
        console.log('No conectado con mongodb');
    }
})();

bot.use(session());
bot.use(stage.middleware());

const pagoMovil = async (ctx, signature, amount, callback) => {
    try {
        await ctx.deleteMessage();
        const res = await getDollarPrices();
        const BCV = res[5].dollar;
        const info = `
                Pago Móvil

CI: V-12.345.678
Banesco
0412-123456789

Transferencia:
4242-4242-4242-4242
Banesco
Rif: 123456789

${signature} (módulo)

Total a pagar: ${(amount * BCV).toFixed(2)} Bs.

                `;
        await ctx.reply(info,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Confirmar pago ✅', callback_data: callback }],
                    ],
                },
            });

    } catch (error) {
        console.log(error);
    }
};
bot.command('login', ctx => {
    ctx.scene.enter('my-login');
});
bot.action('hacerPago', (ctx) => {
    ctx.scene.enter('my-pago-movil');
});
bot.action('cerrar_sesion', async (ctx) => {
    ctx.scene.enter('my-logout');
});
bot.action('pagar_modulo', async (ctx) => {
    if (global.login) {
        pagoMovil(ctx, global.login.userCourse.name, global.login.userCourse.module_price, 'pagarModulo');
    } else if (!global.login) {
        await ctx.reply('Su sesión está cerrada, ingrese usando /login');
    }
});
bot.action('pagarModulo', (ctx) => {
    ctx.scene.enter('my-pago-movil-module');
});
module.exports = bot.middleware();