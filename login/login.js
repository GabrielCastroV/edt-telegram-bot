const mongoose = require('mongoose');
const { Telegraf, session, Scenes: { WizardScene, Stage } } = require('telegraf');
const User = require('../models/users');
const Course = require('../models/courses');
const Grades = require('../models/grades');
require('dotenv').config();

// Creo la wizard scene
const login = new WizardScene(
    'my-login',
    async ctx => {
        ctx.reply('Por favor ingresa tu email:');
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
            await ctx.reply('Email inválido 👎');
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
            await ctx.reply('Correo no encontrado en la base de datos. Recuerda que debes estar cursando el primer módulo o superior para asignarte tu usuario de EDTécnica.');
            return ctx.scene.leave();
        } else if (!verified) {
            // De no estar verificado, le enviamos un correo con su clave temporal.
            const temporalPass = '123456';
            ctx.wizard.state.data.temporalPass = temporalPass;

            await ctx.reply(`${user.name}, ingresa el código que fue enviado a tu correo:`);
            return ctx.wizard.next();
        } else if (user && verified) {
            // Agrego sus modulos y notas a las variables correspondidas.
            for (let i = 0; i < ctx.wizard.state.data.userGrade.length; i++) {
                ctx.wizard.state.data.grades.push(`✯ Módulo ${ctx.wizard.state.data.userGrade[i].module}, calificación: ${ctx.wizard.state.data.userGrade[i].grade}/20`);
                ctx.wizard.state.data.grade += (ctx.wizard.state.data.userGrade[i].grade);
            }
            await ctx.replyWithHTML(`
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
💲 Monto de mensualidad: ${ctx.wizard.state.data.userCourse.price}$
`);
            return ctx.scene.leave();
        }
        return ctx.wizard.next();
    },
    async ctx => {
        ctx.wizard.state.data.code = ctx.message?.text;
        if (ctx.wizard.state.data.code !== ctx.wizard.state.data.temporalPass) {
            await ctx.reply('El codigo ingresado no es valido, intenta loguearte mas tarde.');
            return ctx.scene.leave();
        } else if (ctx.wizard.state.data.code === ctx.wizard.state.data.temporalPass) {
            // Verifico al usuario pe causa
            await User.findByIdAndUpdate(ctx.wizard.state.data.user._id, { verified: true });
            await ctx.reply('ingresando...');
            for (let i = 0; i < ctx.wizard.state.data.userGrade.length; i++) {
                ctx.wizard.state.data.grades.push(`✯ Módulo ${ctx.wizard.state.data.userGrade[i].module}, calificación: ${ctx.wizard.state.data.userGrade[i].grade}/20`);
                ctx.wizard.state.data.grade += (ctx.wizard.state.data.userGrade[i].grade);
            }
            await ctx.replyWithHTML(`
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
💲 Monto de mensualidad: ${ctx.wizard.state.data.userCourse.price}$
`);
            return ctx.scene.leave();
        }

    },

);
const stage = new Stage([login]);
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
bot.command('login', ctx => {
    ctx.scene.enter('my-login');
});
module.exports = bot.middleware();