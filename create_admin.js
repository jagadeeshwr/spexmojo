const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
dotenv.load({path: '.env'});


const User = require('./models').User;
bcrypt.hash('45TCZeDZXuQN4p29', bcrypt.genSaltSync(8)).then(function (password) {
    console.log(password)
    User.create({
        username: 'userpoolsuperadmin',
        email: 'info@userpool.com',
        name: 'Super Admin',
        password: password,
        role: 'SUPER_ADMIN',
        isEmailVerified: true
    }).then(user => {
        console.log(user.get('name'));
        console.log(user.get('email'));

    })

});
