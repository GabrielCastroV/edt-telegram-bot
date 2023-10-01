const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.action('presencial', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion' }, { text: 'Diseño Digital 🎨', callback_data: 'diseno_digital' }],
                    [{ text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes' }, { text: 'Fotografía 📷', callback_data: 'fotografia' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' } ],
                ],
            },
        });
});
bot.action('volver_cursos', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply('Selecciona la modalidad que deseas estudiar', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EDT Plus 👧', callback_data: 'plus' }, { text: 'EDT Presencial', callback_data: 'presencial' }],
                [{ text: '< Volver', callback_data: 'volver_inicio' }, { text: 'EDT Online', callback_data: 'online' }],
            ],
        },
    });
});
const infoSchedules = `
Horarios disponibles:

1. Lunes y Martes, 9am a 12pm, inicia el 13/11/23

2. Miercoles y Jueves, 1pm a 4pm, inicia el 15/11/23

3. Sabados, 9am-12pm, inicia el 25/11/23
`;

// Programación

bot.action('programacion', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Programación Full Stack

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.
    
(⏳ Duración: 6 Meses)
`;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios', callback_data: 'plan_de_estudios_pr' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_pr' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_pr' }, { text: 'Horarios', callback_data: 'horarios' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }, { text: 'Inscribirme ✅', callback_data: 'elige_horario_pr' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Plan de Estudios:

    ✔ Lógica y algoritmo 
    ✔ Fundamentos de la programación I
    ✔ HTML y CSS
    ✔ JavaScript
    ✔ JavaScript Avanzando
    ✔ Node JS
    ✔ Mongo DB
    ✔ Express JS

    Durante todo el BootCamp desarrollarás al menos 10 proyectos reales.  
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_pr' }],
                ],
            },
        });
});
bot.action('como_funciona_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_pr' }],
                ],
            },
        });
});
bot.action('costo_matricula_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    630 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 100 $ c/u 
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_pr' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.reply(infoSchedules,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_pr' }],
                ],
            },
        });
});
bot.action('volver_edt_presencial_pr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Programación Full Stack

Una de las habilidades de mayor demanda laboral es ¡Programador!

Lo sabemos. Ya nosotros estamos en la industria. Y hemos desarrollado un programa con mas de 10 proyectos prácticos, clones, aplicaciones, webs, bases de datos, entre otros que son los pilares para aprender Programación Full Stack.

Al finalizar el curso tendrás tu perfil en LinkedIn activo, te guiamos en la creación de tu portafolio profesional en Git Hub y asesoramos para ofertar en las principales plataformas FreeLancer.

Nuestro objetivo es desarrollar y ayudar a profesionales que puedan trabajar en pijama, acceder a un mercado laboral desde cualquier parte del mundo; que desarrollen proyectos o emprendimiento basado en tecnología.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_pr' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_pr' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_pr' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});

// Diseño digital

bot.action('diseno_digital', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Diseño Digital

La verdad no te diría mucho si te digo que el diseño está presente en todo. Todo es diseño, arte, impresión, empaques y ni que decir de redes sociales. Es decir, una carrera en expansión. 

Hemos diseñado un diplomado genial, super actualizado.

Dentro del Campus EDT cuentas con equipos y todos los software con sus respectivas licencias para practicar tanto como sea posible. 

Estas listo para explotar tu creatividad y vivir de ello.

Esta carrera técnica tiene aval universitario y además tenemos un programa de pasantía brutal.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_dd' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_dd' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_dd' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_dd', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Plan de Estudios:

    ✔ Principios del diseño gráfico
    ✔ Psicología del Color
    ✔ Photoshop I y II
    ✔ Illustrator I y II
    ✔ Paquete para Redes Sociales: Logo, flyers, miniaturas y mas.
    ✔ Paquete para publicidad exterior POP: franelas, tazas, gorras y mas.
    ✔ Paquete para la web: Plantillas, favicon, logos, miniaturas, botones y mucho mas.
    ✔ Diagramación Digital
    ✔ Edición en Móvil
    ✔ Proyecto Final
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_dd' }],
                ],
            },
        });
});
bot.action('como_funciona_dd', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_dd' }],
                ],
            },
        });
});
bot.action('costo_matricula_dd', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    530 $ en total. La modalidad de pago sería:

    Pago 1 - 130 $ y luego 5 cuotas de 80 $ c/u
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_dd' }],
                ],
            },
        });
});
bot.action('volver_edt_presencial_dd', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Diseño Digital

La verdad no te diría mucho si te digo que el diseño está presente en todo. Todo es diseño, arte, impresión, empaques y ni que decir de redes sociales. Es decir, una carrera en expansión. 

Hemos diseñado un diplomado genial, super actualizado.

Dentro del Campus EDT cuentas con equipos y todos los software con sus respectivas licencias para practicar tanto como sea posible. 

Estas listo para explotar tu creatividad y vivir de ello.

Esta carrera técnica tiene aval universitario y además tenemos un programa de pasantía brutal.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_dd' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_dd' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_dd' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});

// Marketing y Redes Sociales

bot.action('marketing_redes', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Marketing Digital y Redes Sociales 

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_mr' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_mr' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_mr' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_mr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Plan de Estudios:

    ✔ El marketing como palanca en los negocios: La máquina de generar prospectos
    ✔ Consumidor digital
    ✔ Mercadeo Digital
    ✔ Tendencias en redes sociales
    ✔ Análisis de Competidores
    ✔ Redacción 2.0
    ✔ Redes sociales para el marketing
    ✔ Analítica web y herramientas
    ✔ Herramientas para validar nichos o descubrir nuevos
    ✔ Marketing de Contenido: Redes sociales y Blogger
    ✔ Marketing de Influencer: análisis, tendencias y negociación
    ✔ E-mail Marketing
    ✔ WhatsApp - Telegram Marketing
    ✔ Manejo de Crisis
    ✔ Herramientas de gestión y optimización
    ✔ Equipo social media dentro de la empresa
    ✔ Plan de marketing ¿Cómo lograr generar prospectos?
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_mr' }],
                ],
            },
        });
});
bot.action('como_funciona_mr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    B-LEARNING - Al menos una o dos clases presenciales en el Campus donde tienes acceso a internet de alta velocidad y computadoras, además tienes acceso al Campus Virtual con clases y sesiones en video.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_mr' }],
                ],
            },
        });
});
bot.action('costo_matricula_mr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    510 $ en total. La modalidad de pago sería:

    Pago 1 - 110 $ y luego 5 cuotas de 80 $ c/u
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_mr' }],
                ],
            },
        });
});
bot.action('volver_edt_presencial_mr', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Marketing Digital y Redes Sociales

La verdad no te diría mucho si te digo que el Marketing Digital es uno de los sectores de mayor crecimiento; no solo laboral, sino en relación a crear tu propia agencia o trabajar como FreeLancer desde cualquier parte del mundo. 

Claro, es importante estudiar, prepararse. El mercado es super competitivo. Por lo tanto hemos diseñado una carrera técnica brutal.

Te explico 

Hay un montón de cursos aislados. Nosotros en una sola carrera, metimos las 4 competencias claves de un marketing: Estrategia, Manejo de crisis, Herramientas de gestión y la maquina de generar prospectos.

Una carrera con aval universitario y programa de pasantía, te dejo esto como nota final.

(⏳ Duración: 6 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_mr' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_mr' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_mr' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});

// Fotografia

bot.action('fotografia', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Fotografía y edición de videos PRO

Desbloquea una habilidad que te permita generar ingresos presencial o remoto desde cualquier parte del mundo. Sí… se trata las artes visuales. 

Cómo puedes estudiar Fotografía y edición de video en EDTécnica 

Algo obvio pero… por si acaso.

Necesitas cualquier cámara, aunque si tienes una PRO sería genial. 

También vas a necesitar alguna versión de Adobe Premiere Pro CC para poder editar tus videos. De todos modos tenemos laboratorio equipado con equipos y todo los software de la suite de adobe para realizar tus prácticas.

¿Qué lograrás una vez finalice tu curso?

Crear tu primera sesión de fotos artística y tu primer trabajo documental.

(⏳ Duración: 4 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_f' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_f' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_f' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});
bot.action('plan_de_estudios_f', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Plan de Estudios:

    ✔ Fotografía nivel I
    ✔ Fotografía Artística
    ✔ Audiovisuales: Pre y Producción
    ✔ Audiovisuales: Haciendo la magia
    ✔ Proyecto Audiovisual
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_f' }],
                ],
            },
        });
});
bot.action('como_funciona_f', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Cómo funciona?

    Semipresencial - Tendrás acceso al campus con internet de alta velocidad, computadoras y monitores para las prácticas y también podrás acceder al Campus Virtual donde tendrás contenido disponible para practicar.
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_f' }],
                ],
            },
        });
});
bot.action('costo_matricula_f', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    ¿Costo por matricula?

    ¡OFERTA fin de trimestre! 360 $ en total. 1er pago 120 $ (inscripción + mensualidad) luego 3 cuotas de 80 $ c/u
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial_f' }],
                ],
            },
        });
});
bot.action('volver_edt_presencial_f', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    const info = `
    Fotografía y edición de videos PRO

Desbloquea una habilidad que te permita generar ingresos presencial o remoto desde cualquier parte del mundo. Sí… se trata las artes visuales. 

Cómo puedes estudiar Fotografía y edición de video en EDTécnica 

Algo obvio pero… por si acaso.

Necesitas cualquier cámara, aunque si tienes una PRO sería genial. 

También vas a necesitar alguna versión de Adobe Premiere Pro CC para poder editar tus videos. De todos modos tenemos laboratorio equipado con equipos y todo los software de la suite de adobe para realizar tus prácticas.

¿Qué lograrás una vez finalice tu curso?

Crear tu primera sesión de fotos artística y tu primer trabajo documental.

(⏳ Duración: 4 Meses)
    `;
    await ctx.reply(info,
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Plan de Estudios 📋', callback_data: 'plan_de_estudios_f' }, { text: '¿Cómo funciona?', callback_data: 'como_funciona_f' }],
                    [{ text: '¿Costo por matricula?', callback_data: 'costo_matricula_f' }, { text: 'Estoy listo!', callback_data: 'asd' }],
                    [{ text: '< Volver', callback_data: 'volver_edt_presencial' }],
                ],
            },
        });
});

// Volver a los cursos presenciales
bot.action('volver_edt_presencial', async (ctx) => {
    try {
        await ctx.deleteMessage();
    } catch (error) {
        console.log(error);
    }
    await ctx.telegram.sendMessage(ctx.chat.id, 'Estos son los cursos disponibles:',
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Programación 💻', callback_data: 'programacion' }, { text: 'Diseño Digital 🎨', callback_data: 'diseno_digital' }],
                    [{ text: 'Marketing y Redes Sociales 📈', callback_data: 'marketing_redes' }, { text: 'Fotografía 📷', callback_data: 'fotografia' }],
                    [{ text: '< Volver', callback_data: 'volver_cursos' } ],
                ],
            },
        });
});
module.exports = bot.middleware();