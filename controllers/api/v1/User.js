const sequelize = require('sequelize');
const User = require('../../../models').User;
const OPTIONS = require('../../../config/options');
const resCode = OPTIONS.resCode;
const Op = sequelize.Op;
const bcrypt = require('bcrypt')
const constantStrings = require('../../../config/ConstantStrings')

exports.sendOtp = async (req, res) => {
    try {
        req.assert('mobileCode', 'countryCode cannot be blank').notEmpty();
        req.assert('mobileNumber', 'mobileNumber cannot be blank ').notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                        errors,
                        OPTIONS.errorTypes.INPUT_VALIDATION
                    )
                );
        }
        const countryCode = req.body.countryCode ? req.body.countryCode.replace(/^\+/, '') : '';

        const query = {
            where: {
                mobileNumber: req.body.mobileNumber,
                countryCode,
                status: OPTIONS.userStatus.ACTIVE,
            },
        };

        const existingUser = await User.findOne(query);
        const OTP = OPTIONS.genOtp();
        if (existingUser) {
            existingUser.tempOtp = OTP;
            const todayDate = new Date();
            todayDate.setDate(todayDate.getDate() + OPTIONS.otpExpireInDays);
            existingUser.tempOtpExpiresAt = todayDate;
            await existingUser.save();

            return res
                .status(resCode.HTTP_OK)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_OK,
                        'OTP send successfully'
                    )
                );
        }
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + OPTIONS.otpExpireInDays);
        await User.create({
            countryCode,
            mobileNumber: req.body.mobileNumber,
            tempOtp: OTP,
            tempOtpExpiresAt: todayDate,
        });

        return res
            .status(resCode.HTTP_OK)
            .json(
                OPTIONS.genRes(resCode.HTTP_OK,'OTP send successfully')
            );
    } catch (e) {
        customErrorLogger(e);
        return res
            .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
            .json(
                OPTIONS.genRes(
                    resCode.HTTP_BAD_REQUEST,
                    OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
                )
            );
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        req.assert('mobileCode', 'countryCode cannot be blank').notEmpty();
        req.assert('mobileNumber', 'mobileNumber cannot be blank').notEmpty();
        req.assert('tempOtp', 'Otp cannot be blank').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                        errors,
                        OPTIONS.errorTypes.INPUT_VALIDATION
                    )
                );
        }
        const {mobileNumber} = req.body;
        const countryCode = req.body.countryCode ? req.body.countryCode.replace(/^\+/, '') : '';
        const query = {
            where: {
                mobileNumber,
                countryCode,
                tempOtpExpiresAt: {[Op.gte]: new Date()},
            },
        };
        const existingUser = await User.findOne(query);
        if (!existingUser) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                        OPTIONS.errorTypes.INPUT_VALIDATION
                    )
                );
        }
        if (parseInt(existingUser.tempOtp) !== parseInt(req.body.tempOtp)) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                        OPTIONS.errorTypes.INPUT_VALIDATION
                    )
                );
        }
        existingUser.tempOtp = null;
        existingUser.isMobileNumberVerified = true;
        existingUser.lastSignInAt = new Date();
        existingUser.tempOtpExpiresAt = null;
        await existingUser.save();
        const userObj = {
            token: existingUser.genToken(),
            name: existingUser.name,
            userName: existingUser.userName,
            profilePicture: existingUser.profilePicture,
            id: existingUser.id,
        };
        return res.status(resCode.HTTP_OK).json(OPTIONS.genRes(resCode.HTTP_OK, userObj));
    } catch (e) {
        customErrorLogger(e);
        return res
            .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
            .json(
                OPTIONS.genRes(
                    resCode.HTTP_INTERNAL_SERVER_ERROR,
                    OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
                )
            );
    }
};



exports.userGetProfile = async (req, res) => {
    try {
        const existingUser = await User.findOne({
            where: {
                id: req.user.id,
            },
            attributes: [
            ],
        });
        if (!existingUser) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                       'USER DOES Not Exist'
                    )
                );
        }
        return res.status(resCode.HTTP_OK).json(OPTIONS.genRes(resCode.HTTP_OK, existingUser));
    } catch (e) {
        customErrorLogger(e);
        return res
            .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
            .json(
                OPTIONS.genRes(
                    resCode.HTTP_INTERNAL_SERVER_ERROR,
                    OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
                )
            );
    }
};

exports.AdminGetUserProfile = async (req, res) => {
    try {
        let userProfile = await User.findOne({
            where: {
                id: req.params.userId,
                role:'user'
            },
        });
        if (!userProfile) {
            return res
                .status(resCode.HTTP_BAD_REQUEST)
                .json(
                    OPTIONS.genRes(
                        resCode.HTTP_BAD_REQUEST,
                        OPTIONS.errorMessage.USER_DOES_NOT_EXIST
                    )
                );
        }
        userProfile = userProfile.toJSON();
        return res.status(resCode.HTTP_OK).json(OPTIONS.genRes(resCode.HTTP_OK, userProfile));
    } catch (e) {
        customErrorLogger(e);
        return res
            .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
            .json(
                OPTIONS.genRes(
                    resCode.HTTP_INTERNAL_SERVER_ERROR,
                    OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
                )
            );
    }
};






