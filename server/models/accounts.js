import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountsSchema = new Schema({
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  premium: { type: Boolean, default: false },
}, { collection: 'users' });

accountsSchema.statics.getAccounts = async function ({ filters, page, accountsPerPage }) {
  const query = {};

  // Apply filters if present
  if (filters) {
    if (filters.given_name) {
      query.given_name = filters.given_name;
    } else if (filters._id) {
      query._id = filters._id;
    } else if (filters.username) {
      query.username = filters.username;
    }
  }

  // Calculate skip count based on pagination
  const skip = page * accountsPerPage;

  // Retrieve accounts based on query and pagination
  const accountsList = await this.find(query)
    .skip(skip)
    .limit(accountsPerPage)
    .exec();


  // Count total number of accounts based on query
  const totalNumAccounts = await this.countDocuments(query);

  return { accountsList, totalNumAccounts };
};

const Account = mongoose.model('Account', accountsSchema);

export default Account;
