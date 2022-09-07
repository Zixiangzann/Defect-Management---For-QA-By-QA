import mongoose from 'mongoose';
import 'dotenv/config'
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    phone:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'owner'],
        default: 'user'
    },
    project: {
        type: []
    },
    firstname: {
        type: String,
        maxLength: 100
    },
    lastname: {
        type: String,
        maxLength: 100
    },
    verified: {
        type: Boolean,
        default: false
    },
    firstlogin: {
        type: Boolean,
        default: true
    },
    passwordresetted: {
        type: Boolean,
        default: false
    },
    jobtitle: {
        type: String,
        maxLength: 100
    },
    permission: {
        type: [{
            addDefect: {
                type: Boolean,
                default: false
            },
            editOwnDefect: {
                type: Boolean,
                default: false
            },
            addComment: {
                type: Boolean,
                default: false
            },
            editOwnComment: {
                type: Boolean,
                default: false
            },
            deleteOwnComment: {
                type: Boolean,
                default: false
            },
            viewAllDefect: {
                type: Boolean,
                default: false
            },
            editAllDefect: {
                type: Boolean,
                default: false
            },
            deleteAllDefect: {
                type: Boolean,
                default: false
            },
            editAllComment: {
                type: Boolean,
                default: false
            },
            deleteAllComment: {
                type: Boolean,
                default: false
            },
            addUser: {
                type: Boolean,
                default: false
            },
            disableUser: {
                type: Boolean,
                default: false
            },
            deleteUser: {
                type: Boolean,
                default: false
            },
            changeUserDetails: {
                type: Boolean,
                default: false
            },
            resetUserPassword: {
                type: Boolean,
                default: false
            },
            addProject: {
                type: Boolean,
                default: false
            },
            assignProject: {
                type: Boolean,
                default: false
            },
            deleteProject: {
                type: Boolean,
                default: false
            },
            addComponent: {
                type: Boolean,
                default: false
            },
            deleteComponent: {
                type: Boolean,
                default: false
            },

        }]
    },
    disabled: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    let user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();

})

userSchema.statics.emailTaken = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
}

userSchema.statics.usernameTaken = async function (username) {
    const user = await this.findOne({ "username": username.toLowerCase().trim() })
    return !!user;
}

userSchema.statics.phoneTaken = async function (phone) {
    const user = await this.findOne({ "phone": phone.trim() })
    return !!user;
}

userSchema.methods.generateAuthToken = function () {
    let user = this;
    const userObj = { sub: user._id.toHexString(), email: user.email };
    const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: '1d' })
    return token;
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    let user = this;
    const match = await bcrypt.compare(candidatePassword, user.password);
    return match;
}

userSchema.methods.generateRegisterToken = function () {
    let user = this;
    const userObj = { sub: user._id.toHexString() };
    const token = jwt.sign(userObj, process.env.DB_SECRET, { expiresIn: '1d' })
    return token;
}


const User = mongoose.model('User', userSchema)

export default User