//http://localhost:9000/.netlify/functions/sheets
const sendMail = require('sendmail')()
const { validateEmail, validateLength } = require('../utils/validations')

exports.handler = (event, context, callback) => {
    // if (!process.env.CONTACT_EMAIL) {
    //     return callback(null, {
    //         statusCode: 500,
    //         body: 'process.env.CONTACT_EMAIL must be defined',
    //     })
    // }

    const body = JSON.parse(event.body)
    console.log(event)
    console.log(body.email)
    try {
        validateLength('body.name', body.name, 3, 50)
    }
    catch (e) {
        return callback(null, {
            statusCode: 403,
            body: e.message
        })
    }

    try {
        validateEmail('body.email', body.email)
    }
    catch (e) {
        return callback(null, {
            statusCode: 403,
            body: e.message
        })
    }

    try {
        validateLength('body.details', body.details, 10, 1000)
    }
    catch (e) {
        return callback(null, {
            statusCode: 403,
            body: e.message
        })
    }

    const descriptor = {
        from: `"${body.email}" <no-reply@gql-modules.com>`,
        to: "shannon@carepoint.co",
        subject: `${body.name} sent you a message from gql-modules.com`,
        text: body.details,
    }

    sendMail(descriptor, (e) => {
        if (e) {
            callback(null, {
                statusCode: 500,
                body: e.message
            })
        }
        else {
            callback(null, {
                statusCode: 200,
                body: '',
            })
        }
    })
}