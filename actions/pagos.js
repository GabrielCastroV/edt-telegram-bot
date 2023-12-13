const { Telegraf } = require('telegraf');
const { Registration } = require('../models/payments');
const Course = require('../models/courses');
const { getDollarPrices } = require('venecodollar');
require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN);

// inscribirse/pagar (funcion) Credit Card Method

const signUp = async (ctx, signature, at, photo_url) => {
    try {
        const course = await Course.find();
        await ctx.deleteMessage();
        const invoice = {
            title: `Curso de ${signature}`,
            description: `¡Potencia tu futuro con nuestro curso de ${signature}! Obtén la certificación que necesitas y lleva tu formación académica al siguiente nivel. Desarrolla habilidades de alto valor y alcanza tus metas educativas de manera eficaz!`,
            payload: signature,
            provider_token: process.env.GLOCAL_TOKEN,
            currency: 'USD',
            prices: [
                {
                    label: signature,
                    amount: (course[at].registration_price * 100),
                },
            ],
            photo_url: photo_url,
            need_name: true,
            need_email: true,
            need_phone_number: true,
            send_email_to_provider: true,
            photo_size: 4,
            photo_width: 512,
            photo_height: 512,
        };
        await ctx.sendInvoice(invoice);
    } catch (error) {
        ctx.reply(`ha ocurrido un error (${error})`);
        console.log(error);
    }
};

// Pago Movil method.

const pagoMovil = async (ctx, signature, at, callback) => {
    try {
        await ctx.deleteMessage();
        const res = await getDollarPrices();
        const BCV = res[5].dollar;
        const modulePrice = await Course.find();
        const info = `
                Pago Móvil

CI: V-12.345.678
Banesco
0412-123456789

${signature} (Inscripción)

Total a pagar: ${(modulePrice[at].registration_price * BCV).toFixed(2)} Bs.

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

const dataInfo = {};

bot.on('pre_checkout_query', async (ctx) => {
    try {
        await ctx.answerPreCheckoutQuery(true);
        const { id, from, currency, total_amount, invoice_payload, order_info } = ctx.update.pre_checkout_query;
        const userData = {
            orderID: id,
            username: from.username ?? 'user',
            first_name: from.first_name,
            currency: currency,
            total: (total_amount),
            signature: invoice_payload,
            name: order_info.name,
            email: order_info.email,
            phone: order_info.phone_number,
        };

        // Guardo los datos del comprador en la variable dataInfo.
        dataInfo.userData = userData;
    } catch (error) {
        await ctx.answerPreCheckoutQuery(false, 'La compra no pudo ser procesada.');
        console.log(error);
    }
});

bot.on('successful_payment', async (ctx) => {
    const newRegistration = new Registration({
        username: dataInfo.userData.username,
        order_id: dataInfo.userData.orderID,
        first_name: dataInfo.userData.first_name,
        currency: dataInfo.userData.currency,
        total: (dataInfo.userData.total / 100),
        course: dataInfo.userData.signature,
        name: dataInfo.userData.name,
        email: dataInfo.userData.email,
        phone: dataInfo.userData.phone,
        verified: false,
    });
    await newRegistration.save();
    await ctx.replyWithSticker('CAACAgIAAxkBAAEnZ7JlRnVEqWj7As0G2IF0WFywM3tTUgACTwEAAiI3jgR8lZdITHG8FzME');
    await ctx.reply('Felicidades, su pago ha sido procesado exitosamente.');
});


module.exports = {
    signUp: signUp,
    pagoMovil: pagoMovil,
    middleware: bot.middleware(),
};