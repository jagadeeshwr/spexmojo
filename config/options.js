const _ = require('lodash');
const pug = require('pug');
const AWS_Options = require('./awsOptions');

const options = {
  appVersion: "1.0.0",
  otpExpireInMinutes: 24 * 60,
  appSchemaUrl: "treblequest",
  dashboardTimezone: "Asia/Kolkata",
  otherNotificationTimezone: "Asia/Kolkata",
  otherNotificationTime: "6:00 AM",
  randomUsernameSize: 8,
  randomInvitationCodeSize: 8,
  maxDayProgramLength: 10,
  allowedAccessWithoutEmailVerifiedForHours: 5 * 24,
  sendEmailVerifiedEveryHours: 24,
  loginSessionInMilliseconds: 30 * 24 * 60 * 60 * 1000,
  hashtagTrendingMaxTaggedInHours: 72,
  hashtagTrendingLastHoursAndPastRatio: 0.4,
  resetPasswordExpireInDays: 720,
  hashtagRelatedHashtags: 3,
  userElasticsearchIndexName: 'tq-users',
  branchIoType: {
    INVITATION: "invitation",
    USER_INVITATION: "user_invitation",
  },
  userRegistrationSource: {
    WEB: "web",
    APP: "app",
  },
  queueTypes: {
    UPDATE_CREDIT: "update_credit",
    SYNC_USER_DATA: "sync_user_data",
    NEW_POST_NOTIFY: "new_post_notify",
    TRIGGER_BATCH_NEW_POST: "trigger_batch_new_post",
  },
  notificationString: {
    getString: function (type, creator, data) {
      if (type === options.notificationType.FOLLOW_USER) {
        return `${creator} started following you!`
      }else if(type === options.notificationType.NEW_POST){
        return `${creator} posted a new ${data.postType}: '${data.title}'`
      }
    }
  },
  socketPrivateGroups: {
    USER_PRIVATE: "user.id#",
    GLOBAL_CHANNEL: "globalChannel",
  },
  socketPublicGroups: {
    USER_PROFILE: "user.profile#",
    POST_UPDATE: "post.id#",
  },
  socketBroadcastType: {
    USER_PROFILE_META: "user_profile_meta",
  },
  interestStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    DELETED: "deleted",
  },
  permissionMatrix: {
    user: {
      label: "User",
      value: "user",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    appSettings: {
      label: "App Settings",
      value: "app_settings",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    topics: {
      label: "Topics",
      value: "topics",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    getAdminPermissions: function () {
      return [
        options.permissionMatrix.user,
        options.permissionMatrix.appSettings,
        options.permissionMatrix.topics,
      ];
    },

    getLabel: function (permission) {
      return options.permissionMatrix[permission];
    },
  },
  userStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    DELETED: "deleted",
  },
  languageStatus: {
    ENABLED: "enabled",
    DISABLED: "disabled",
    BLOCKED: "blocked",
    DELETED: "deleted",
  },

    workspaceStatus: {
        ACTIVE: "active",
        INACTIVE: "inactive",
        BLOCKED: "blocked",
        DELETED: "deleted",
    },

  organizationStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    DELETED: "deleted",
  },



  demoStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    DELETED: "deleted",
  },
  postStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    DELETED: "deleted",
  },
  socketOnEvents: {
    AUTHENTICATE: "authenticate",
    NOTIFICATION_LISTING: "notification_listing",
    NOTIFICATION_MARK: "notification_mark",
    NOTIFICATION_DELETE: "notification_delete",
    NOTIFICATION_UNREAD_COUNT: "notification_unread_count",
    NOTIFICATION_CREATE: "notification_create",
    POST_CREATE: "post_create",
    POST_LISTING: "post_listing",
    POST_TRENDING_LISTING: "post_trending_listing",
    POST_GET_FEEDS: "post_get_feeds",
    POST_GET: "post_get",
    POST_DELETE: "post_delete",
    POST_LIKE: "post_like",
    POST_SAVE:"post_save",
    POST_UNSAVE:"post_unsave",
    POST_GET_SAVED_LISTING:"post_get_saved_listing",
    POST_GET_MY_POSTS:"post_get_my_posts",
    POST_SHARE:"post_share",
    POST_COMMENT: "post_comment",
    POST_GET_LIKED_USERS: "post_get_liked_users",
    POST_COMMENT_LISTING: "post_comment_listing",
    FOLLOW_USER: "follow_user",
    UNFOLLOW_USER: "unfollow_user",
    FOLLOWERS_LISTING: "followers_listing",
    FOLLOWING_LISTING: "following_listing",
    HASHTAG_TRENDING: "hashtag_trending",
    HASHTAG_FEATURED: "hashtag_featured",
    HASHTAG_RECOMMANDED: "hashtag_recommanded",
    HASHTAG_POSTS: "hashtag_posts",
    HASHTAG_AUTOCOMPLETE: "hashtag_autocomplete",
    USER_BLOCKED_LISTING: "user_blocked_listing",
    USER_BLOCK: "user_block",
    USER_UNBLOCK: "user_unblock",
    USER_USERNAME_AUTOCOMPLETE: "user_username_autocomplete",
    USER_PROFILE_UPDATE: "user_profile_update",
    USER_MY_UPDATE: "user_my_update",
    GROUP_JOIN: "group_join",
    GROUP_LEAVE: "group_lead",
  },
  notificationStatus: {
    ACTIVE: "active",
    INACTIVE: "in_active",
    DELETE: "delete",
  },

  genreStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    BLOCKED: "blocked",
    DELETED: "deleted",
    APPROVED: 'approved',
    UNAPPROVED: "unapproved"
  },


  socketEmitEvents: {
    AUTHENTICATE: "authenticate",
    SERVER_ERROR: "server_error",
  },
  topicStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    DELETED: "deleted",
  },
  usersRoles: {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    USER: "USER",
    getAllRolesAsArray: function () {
      return [
        options.usersRoles.SUPER_ADMIN,
        options.usersRoles.ADMIN,
        options.usersRoles.USER,
      ];
    },
  },
  genders: {
    MALE: "Male",
    FEMALE: "Female",
    TRANSGENDER: "Transgender",
  },
  devicePlatforms: {
    ANDROID: "android",
    IOS: "ios",
    WEB: "web",
  },
  signInProviders: {
    EMAIL: "email",
    MOBILE_NUMBER: "mobile_number",
    FACEBOOK: "facebook",
    GOOGLE: "google",
  },
  notificationMode: {
    NOTIFICATION_TRIGGER_ALL: "notification_trigger_all",
    NOTIFICATION_TRIGGER_EMAIL: "notification_trigger_email",
    NOTIFICATION_TRIGGER_IN_APP: "notification_trigger_in_app",
  },
  notificationType: {
    FOLLOW_USER: "follow_user",
    NEW_POST: "new_post",
  },
  notificationDeliveryMedium: {
    FCM: "fcm",
    SMS: "sms",
    EMAIL: "email",
    IN_APP: "in_app",
  },
  agendaDefinition: {
    HASHTAG_TRENDING_UPDATE: "hashtag:trending:update",
    HASHTAG_TRENDING: "hashtag:trending",
  },
  userNamePrefix:"TQ",
  resCode: {
    HTTP_OK: 200,
    HTTP_CREATE: 201,
    HTTP_NO_CONTENT: 204,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_METHOD_NOT_ALLOWED: 405,
    HTTP_CONFLICT: 409,
    HTTP_INTERNAL_SERVER_ERROR: 500,
    HTTP_SERVICE_UNAVAILABLE: 503,
  },
  errorTypes: {
    OAUTH_EXCEPTION: "OAuthException",
    ALREADY_AUTHENTICATED: "AlreadyAuthenticated",
    UNAUTHORISED_ACCESS: "UnauthorisedAccess",
    INPUT_VALIDATION: "InputValidationException",
    ACCOUNT_ALREADY_EXIST: "AccountAlreadyExistException",
    ACCOUNT_DOES_NOT_EXIST: "AccountDoesNotExistException",
    ENTITY_NOT_FOUND: "EntityNotFound",
    ACCOUNT_BLOCKED: "AccountBlocked",
    ACCOUNT_DEACTIVATED: "AccountDeactivated",
    CONTENT_BLOCKED: "ContentBlocked",
    CONTENT_REMOVED: "ContentRemoved",
    PRIVATE_CONTENT: "PrivateContent",
    PRIVATE_ACCOUNT: "PrivateAccount",
    DUPLICATE_REQUEST: "DuplicateRequest",
    EMAIL_NOT_VERIFIED: "emailNotVerified",
    MOBILE_NUMBER_NOT_VERIFIED: "mobileNumberNotVerified",
    INTERNAL_SERVER_ERROR: "InternalServerError",
  },
  apiErrorStrings: {
    MOBILE_NUMBER_ALREADY_IN_USE: 'The Mobile number is already in use. Please try again using a different Mobile number',
    INVALID_REQUEST: 'Invalid request',
    SERVER_ERROR: 'Oops! something went wrong',
    USER_DOES_NOT_EXIST:'The user does not exist!',
    PASSWORD_DOES_NOT_MATCH:'The Password does not match.',
    OTP_SEND_FAILED:'OTP send failed!',
    OTP_INVALID:'OTP is invalid or has expired.',
    ACCOUNT_BLOCKED:'Your account has been blocked!',
    ACCOUNT_DEACTIVATED:'Your account has been deactivated!',
    USERNAME_ALREADY_IN_USE:'The username you have entered is already associated with an account.',
    USER_BLOCKED:"You're account has been blocked,if you think it's a mistake please contact admin.",
    NOTHING_INVITE: 'Nothing to invite',
    USERNAME_NOT_AVAILABLE: "User name is not available",
    SECURITY_CODE_CHANGE: "Security Code is invalid or has expired.",
    ID_REQUIRED: "Please send Valid id",
    ABUSED_ALREADY: "Abused post already",
    POST_SAVED_ALREADY: "Post already saved",
    POST_NOT_SAVED:"Post not saved "
  },
  apiSuccessStrings:{
   PASSWORD_RESET: 'Your password has been reset!',
   TOKEN_SAVED: 'Token saved!',
   INVITATION_SENT_SUCCESSFULLY: `Invitation sent successfully!.`,
   LOGOUT_SUCCESS:'Logout successfully!',
   OTP_SENT_SUCCESS:'OTP sent successfully!',
   USERNAME_SUCCESS:'User Name available',
   USERNAME_CHANGE:"Your Username has been Changed as ",
   TOPICS_SUCCESS: "Topics Added successfully",
   FEEDBACK_SUCCESS: "Your feedBack has been submitted successfully!",
   ABUSE_SUCCESS: "Post Abused Successfully!",
   POST_SAVED: "Post Saved",
   POST_UNSAVED:"Post UnSaved"
  },
  transactionTypes: {
    DEBIT: "debit",
    CREDIT: "credit",
  },
  transactionActionType: {
    SIGN_UP: 'sign_up',
    LIKE: 'like',
    UNLIKE: 'unlike',
    COMMENT: 'comment',
    POST_CREATE: 'post_create',
    DAILY_REWARD: 'daily_reward',
    REPORT_CONTENT: 'report_content',
    POST_DELETE: 'post_delete',
    USER_COLLECT_REWARD: "user_collect_reward"
  },
  newPostNotificationTypes: {
    POST_COMMENT_MENTION: 'post_comment_mention',
    NEW_POST_TO_FOLLOWER: 'new_post_to_follower',
    COMMENT_RECEIVE: 'comment_receive',
    NEW_LIKE: 'new_like',
    NEW_FOLLOWER: 'new_follower'
  },
  topicARNS: {
    globalNotificationARN: 'NotificationsTopic',
    postNewLikeARN: 'postNewLike',
    followARN: 'FollowTopic',
    newPostARN: 'newPostTopic',
    walletARN:"TransactionPoint",

  },
  triggerAtCount:[1,3,5,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,30,50,90,300,490,990],
  triggerAtAppreciationCount:[100,500,1000,5000,10000,50000,100000],

  otpExpireInDays: 1,
  resetPasswordOTPExpireInDays: 1,
  emailVerificationExpireInDays: 1,
  redisExpiries:{
    SHAREEXPIRY:259200
  },
  genOtp: () => {
   // return Math.floor(1000 + Math.random() * 9000);
    return 5555
  },
  genOtpMessage: (otp) => {
    return otp + " is your OTP for your account!";
  },
  genAjaxRes: (status, message, result) => {
    status = status || 0;
    message = message || null;
    result = result || null;
    return {
      status: status,
      message: message,
      result: result,
    };
  },
  genRes: (code, payload, type, noWrapPayload) => {
    noWrapPayload = noWrapPayload || false;
    type = type || "unknown";

    if (code && code >= 300) {
      payload = _.isArray(payload) ? payload : [payload];
      var plain_text_errors =
        payload.length > 0 && _.isString(payload[0]) ? payload : [];
      var object_errors =
        payload.length > 0 && _.isObject(payload[0]) ? payload : [];
      var output = {
        error: {
          errors: plain_text_errors,
          error_params: object_errors,
          code: code,
          type: type,
        },
      };
      return output;
    } else {
      // success data
      if (payload && !noWrapPayload) {
        return { result: payload };
      } else if (payload) {
        return payload;
      } else {
        return undefined;
      }
    }
  },
  genUrl: (path, type) => {
    switch (type) {
      case "superAdmin":
        return process.env.SUPER_ADMIN_BASE_PATH + path;
        break;
      default:
        return BASE_PATH + path;
        break;
    }
  },
  genAbsoluteUrl: (path, type, opt) => {
    switch (type) {
      case "admin":
        return process.env.CLIENT_REQUEST_PROTOCOL + '://' + process.env.ADMIN_HOST + path;
      default:
        return process.env.CLIENT_REQUEST_PROTOCOL + '://' + process.env.CUSTOMER_HOST + path;
    }
  },
  genHtml: (template, data) => {
    return pug.renderFile(__dirname + '/../email_templates/' + template + '.pug', data);
  },
  pad: (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  },
  kFormatter: function kFormatter(num) {
    return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
  },
  getBackgroundProcessBasePath: function () {
    return process.env.CLIENT_REQUEST_PROTOCOL + "://" + process.env.HOST;
  },
  handleSocketErrorException: function (socket, e) {
    customErrorLogger(e);
    if (e.event) {
      return socket.emit(e.event, {
        msg: e.message,
        type: e.type,
      });
    } else {
      return socket.emit(options.socketEmitEvents.SERVER_ERROR, {
        msg: "Oops! something went wrong.",
        type: options.errorTypes.INTERNAL_SERVER_ERROR,
      });
    }
  },
  generateCloudFrontUrl: AWS_Options.generateCloudFrontUrl,
  generateShareLink: (prefix, code) => {
    return options.genAbsoluteUrl(
      process.env.API_BASE_PATH + "s/" + prefix + code
    );
  },
  decodeShareLink: (codeWithPrefix) => {
    return {
      prefix: codeWithPrefix.substring(0, 1),
      code: codeWithPrefix.substring(1),
    };
  },
  isWeekendToday: () => {
    let dt = new Date();
    return !!(dt.getDay() === 6 || dt.getDay() === 0);
  },

  userPreferences: {
    mobileNumber: {
      name: 'MOBILE_NUMBER',
      title: 'Mobile Number',
      description: 'To make Phone number public.'
    },
    profilePicture: {
      name: 'PROFILE_PICTURE',
      title: 'Profile Picture',
      description: 'To make Profile Picture public.'},
    email: {
      name: 'EMAIL',
      title: 'Email',
      description: 'To make E-mail ID public.'
    },


    getAsArray: () =>{
      return [
          options.userPreferences.mobileNumber,
          options.userPreferences.profilePicture,
          options.userPreferences.email,
      ]
    }
  },


};



module.exports = options;
