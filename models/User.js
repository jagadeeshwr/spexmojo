const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtOptions');
const OPTIONS = require("../config/options");

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },

        mobileNumber: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        mobileCode: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isRegistered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAdminAdded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        permissions: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('permissions'));
            },
            set: function (val) {
                return this.setDataValue('permissions', JSON.stringify(val));
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: OPTIONS.userStatus.ACTIVE
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                let path = this.getDataValue('picture');
                if (path && path.length > 0) {
                    return OPTIONS.generateCloudFrontUrl(path);
                } else {
                    return this.getDataValue('socialProfilePicture')
                }
            }
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        timestamps: true,
        freezeTableName: true
    });

    User.prototype.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    };
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };
    User.prototype.genToken = function (password) {
        const payload = {id: this.id};
        return jwt.sign(payload, jwtOptions.secretOrKey);
    };


    (async () => {
        if (process.env.ENVIRONMENT !== 'prod') {
            await sequelize.sync();
        }
    })();

    return User;
};
