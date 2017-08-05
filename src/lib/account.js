import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

mongoose.Promise = global.Promise

const schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  key: {
    type: String,
    default: bcrypt.genSaltSync(8)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

schema.set('toJSON', {virtuals: true})
schema.set('toObject', {virtuals: true})

schema.pre('save', function(next) {
  let account = this
  if (this.isModified('password') || this.isNew) {
    account.password = bcrypt.hashSync(account.password, bcrypt.genSaltSync(10), null)
    return next()
  } else {
    return next()
  }
})

schema.statics = {
  match(password, hash) {
    return bcrypt.compareSync(password, hash)
  },
  hash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  }
}

export default mongoose.model('Account', schema)


/*
let a = new Account()
a.email = 'jondough@email.com'
a.password = '$2a$10$eU.FTZ56KPJEpiDSX7Ud2.h8zScFyT1o3VhROh6NGwTN1qSsdQMfe'
a.key = '$2a$38$61pFX.d4HrwRuK6bZYEwp.'
a.createdAt = ISODate("2017-08-01T02:10:24.501Z")
}
*/
