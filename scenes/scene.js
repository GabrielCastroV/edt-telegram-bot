const mongoose = require('mongoose');
const { Telegraf, session, Scenes: { WizardScene, Stage }, Markup } = require('telegraf');
const nodemailer = require('nodemailer');
const User = require('../models/users');
const Course = require('../models/courses');
const Grades = require('../models/grades');
const { getDollarPrices } = require('venecodollar');
const { PagoMovil, Registration } = require('../models/payments');
require('dotenv').config();

const data = {};

// Panel del login.
const loginPanel = async ctx => {
    const { module, payday } = await User.findOne({ email: data.login.user.email });

    // Agrego sus modulos y notas a las variables correspondidas.
    for (let i = 0; i < data.login.userGrade.length; i++) {
        data.login.grades.push(`✯ Módulo ${data.login.userGrade[i].module}, calificación: ${data.login.userGrade[i].grade}/20`);
        data.login.grade += data.login.userGrade[i].grade;
    }
    const info = (`
    Bienvenido <b>${data.login.user.name}</b> 👋
    
<u>Información del Estudiante: </u>
    
🎓 Cursando: ${data.login.userCourse.name}
🌐 Modalidad: ${data.login.userCourse.modality}
    
📖 Módulo actual: ${module}/${data.login.userCourse.modules}
📊 Asistencia: ${data.login.user.attendance}%

${data.login.grades.join(' \n')}

🏆 Actual promedio de notas: ${(data.login.grade / module).toFixed(0)}
📝 Nota final hasta ahora: ${(data.login.grade / data.login.userCourse.modules).toFixed(0)}
    
🗓️ Próximo pago: ${payday.toLocaleDateString()}
💲 Monto de mensualidad: ${data.login.userCourse.module_price}$
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
    data.login.grade = 0;
    data.login.grades = [];
};

// Login Wizard Scene
const login = new WizardScene(
    'my-login',
    async ctx => {
        if (data.login) {
            ctx.deleteMessage();
            loginPanel(ctx);
            return ctx.scene.leave();
        }
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
            await ctx.reply('Eso no es un email.');
            // Salgo de la escena
            return ctx.scene.leave();
        }
        // Consulto a la base de datos para buscar el usuario por correo electrónico
        const user = await User.findOne({ email: ctx.wizard.state.data.email });
        // Consulto tambien que curso esta estudiando y sus notas
        const userCourse = await Course.findOne({ _id: user?.studying });
        const userGrade = await Grades.find({ user: user?._id });

        // Guardo la info del usuario para usarla luego.
        ctx.wizard.state.data.user = user;
        ctx.wizard.state.data.userCourse = userCourse;
        ctx.wizard.state.data.userGrade = userGrade;
        ctx.wizard.state.data.grades = [];
        ctx.wizard.state.data.grade = 0;
        if (!user) {
            // Si el correo no existe en la base de datos, le notifico y cierro escena.
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZBJlRY-oHk-8ktm0jVsC66GCva6s1wACuQ4AAmxu8Emp2F_Xn3emBjME');
            await ctx.reply('Usted no es estudiante de EDT, le invitamos a registrarse como estudiante en www.virtualassistantbot.com/create');
            return ctx.scene.leave();
        }
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
    },
    async ctx => {
        ctx.wizard.state.data.code = ctx.message?.text;
        // Hago una comparación superficial utilizando el código enviado al correo.
        if (ctx.wizard.state.data.code != ctx.wizard.state.data.temporalPass) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZBplRZBNdqpNrI74ZhhZKQobfuIfPAACTgADr8ZRGvFh67KaK5_kMwQ');
            await ctx.reply('Alto ahi! el codigo ingresado no es válido, intenta loguearte mas tarde.');
            return ctx.scene.leave();
        } else if (ctx.wizard.state.data.code == ctx.wizard.state.data.temporalPass) {
            // Guardo los datos en la variable data
            data.login = ctx.wizard.state.data;
            // Agrego el panel del login
            loginPanel(ctx);
            return ctx.scene.leave();
        }

    },
);

// Logout Wizard Scene
const logout = new WizardScene(
    'my-logout',
    async ctx => {
        await ctx.deleteMessage();
        data.login = '';
        await ctx.replyWithSticker('CAACAgIAAxkBAAEnY_xlRX7oRcuZjGTRzJLv1QXd3VhMIwACSQIAAladvQoqlwydCFMhDjME');
        await ctx.reply('Sesión cerrada.');
        await ctx.scene.leave();
    },
);

// Pago movil Wizard Scene
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
        // Creo un menú con opciones multiples.
        const replyKeyboard = Markup.keyboard([
            ['Programación', 'Marketing'],
            ['Fotografía', 'Diseño Digital'],
            ['Programación Online', 'Marketing Online'],
            ['Robótica'],
        ]).resize();
        await ctx.reply('Selecciona el curso que deseas comprar:', replyKeyboard);
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.wizard.state.data.course = ctx.message?.text;

        const validOptions = [
            'Programación', 'Marketing',
            'Fotografía', 'Diseño Digital',
            'Programación Online', 'Marketing Online',
            'Robótica',
        ];
        // En caso de elegir mal la opción.
        if (!validOptions.includes(ctx.wizard.state.data.course)) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnY_5lRX_tdZ_8vOi0_QwTrR49yxn5wwACAQIAAhZCawotBlJ7kvEiDDME');
            await ctx.reply('La opción es inválida.');
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

        // Verifico que sea un monto numérico y que tenga dos decimales opcionales separado por punto.
        const AMOUNTREGEX = /^\d+(\.\d{1,2})?/;
        const amountValidation = AMOUNTREGEX.test(ctx.wizard.state.data.amount);

        // De no ser un monto valido, manejo el error de esta forma
        if (!amountValidation) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZCplRZNZzhcmJvOk0fp6hjzTIgiNrgACfQAD9wLIDy7JuwrdyyJJMwQ');
            await ctx.reply('Monto inválido, el formato debe ser solo números. En caso de tener cifras decimales, deben ser separadas con un punto (.) recuerda que solo son 2 cifras después del punto.');
            return ctx.scene.leave();
        }

        // Creo el recibo del pago movil del usuario.
        const newRegistration = new Registration({
            order_id: ctx.wizard.state.data.ref,
            username: ctx.update.message.chat.username ?? 'private user',
            first_name: ctx.update.message.chat.first_name ?? 'private user',
            currency: 'VES',
            total: ctx.wizard.state.data.amount,
            course: ctx.wizard.state.data.course,
            name: null,
            email: ctx.wizard.state.data.email,
            phone: null,
            verified: false,
        });

        // Procedo a enviar el nuevo pago movil a la base de datos.
        await newRegistration.save();

        await ctx.replyWithSticker('CAACAgIAAxkBAAEnY_ZlRXwZCgqt4TXfusUiwb4LJ6-SWgACaAADwDZPE0z9PaPnxGmHMwQ');
        await ctx.reply('Procesando el pago, nos comunicaremos con usted pronto. Bienvenido a EDTécnica.');
        // Cierro la escena
        return ctx.scene.leave();
    },
);

// Pago Movil de módulos para estudiantes Wizard Scene
const pagoMovilModuleScene = new WizardScene(
    'my-pago-movil-module',
    async ctx => {
        const user = await User.findOne({ email: data?.login?.email });
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
        ctx.wizard.state.data.ref = ctx?.message?.text;
        const REF_REGEX = /^\d{4}$/;
        const refValidation = REF_REGEX.test(ctx.wizard.state.data.ref);
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
        try {
            const newPagoMovil = new PagoMovil({
                email: data.login.email,
                course: data.login.userCourse.name,
                modality: data.login.userCourse.modality,
                module: data.login.userCourse.module,
                payday: data.login.userCourse.payday,
                module_price: data.login.userCourse.module_price,
                amount: ctx.wizard.state.data.amount,
                ref_number: ctx.wizard.state.data.ref,
                verified: false,
            });
            await newPagoMovil.save();
        } catch (error) {
            await ctx.replyWithSticker('CAACAgIAAxkBAAEnZCplRZNZzhcmJvOk0fp6hjzTIgiNrgACfQAD9wLIDy7JuwrdyyJJMwQ');
            await ctx.reply('Monto inválido, el formato debe ser solo números. En caso de tener cifras decimales, deben ser separadas con un punto (.) recuerda que solo son 2 cifras después del punto.');
            return ctx.scene.leave();
        }
        await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ3NlRmac0lOpSBGuVHXf9u3PgWS9hgACBAEAAvcCyA8gD3c76avISTME');
        await ctx.reply('Procesando el pago, nos comunicaremos con usted mediante correo electrónico');
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

${signature} (Módulo)

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
    if (data.login) {
        pagoMovil(ctx, data.login.userCourse.name, data.login.userCourse.module_price, 'pagarModulo');
    } else if (!data.login) {
        await ctx.reply('Su sesión está cerrada, ingrese usando /login');
    }
});
bot.action('pagarModulo', (ctx) => {
    ctx.scene.enter('my-pago-movil-module');
});
module.exports = bot.middleware();