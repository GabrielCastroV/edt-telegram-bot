const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('preguntas', (ctx) => {
    const faq = `
    ¿Cuáles son los métodos de pago? 💳
    
        ↳ Contamos con 5 formas de pago: Pago móvil, Binance, Paypal o transferencias a Banco Provincial y Banco Plaza.
    
    ¿Poseen plan de financiamiento? 💰
    
        ↳ Sí, nos adaptamos a tus necesidades, para que puedas hacer posible y lograr tu meta.
    
    ¿Qué tipo de certificación entregan? 📜
    
        ↳ Certificado, avalado por la Universidad Pedagógica Experimental Libertador (UPEL).
    
    ¿La carrera tiene alguna validez a nivel internacional? 🌎
    
        ↳ Sí, puedes legalizar tu certificado en el Ministerio del Poder Popular para Relaciones Exteriores (MPPRE) y luego ser apostillado.
    
    ¿Luego de culminar ofrecen oportunidad de trabajo directa? 👨‍💻
    
        ↳ No, sin embargo, trabajamos con marcas aliadas que dependiendo de tu desempeño y creatividad en el transcurso de la carrera, puedes optar por pasantías.
    
    ¿Cuentan con herramientas y equipo de trabajo? 💻
        ↳ Sí, en nuestras instalaciones tendrás todos los equipos necesarios.
    `;
    ctx.reply(faq);
});

module.exports = bot.middleware();