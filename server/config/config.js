/**
 * Created by Michal Wozniak on 1/3/2016.
 */
module.exports = {

    db: {
        production : '',
        development : 'mongodb://localhost/NodeTutorial',
        test : 'mongodb://localhost/test'
    },
    //email account for nodemailer
    email: {
        service: 'gmail',
        account: {
            user: 'mydashboardsystem@gmail.com',
            pass: 'Q1w2e3r4t5y6u7'
        }
    }
};