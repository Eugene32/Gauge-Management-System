const { AuthenticationError } = require('apollo-server-express');
const { User, Gauge, Category, Admin, Tracking } = require('../models');
const { signToken } = require('../utils/auth');
//const { adminSignToken } = require('../utils/authadmin');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },
    user: async (_, { username }) => {
      return User.findOne({ username });
    },

    admins: async () => {
      return Admin.find();
    },
    admin: async (_, { adminname }) => {
      return Admin.findOne({ adminname });
    },


    gauges: async () => {
      return Gauge.find()
        .populate('category')
        .sort({ gauge_name: 1 });
    },

    categories: async () => {
      return Category.find();
    },

    gauge: async (_, { gaugeId }) => {
      return Gauge.findOne({ _id: gaugeId })
        .populate('category');
    },


    // thoughts: async (parent, { username }) => {
    //   const params = username ? { username } : {};
    //   return Thought.find(params).sort({ createdAt: -1 });
    // },

    // me: async (parent, args, context) => {
    //   if (context.user) {
    //     return User.findOne({ _id: context.user._id }).populate('thoughts');
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
  },

  Mutation: {
    addUser: async (_, { username, email, password, isAdmin }) => {
      const user = await User.create({ username, email, password, isAdmin });
      const token = signToken(user);
      return { token, user };
    },

    addAdmin: async (_, { adminName, adminEmail, adminPassword }) => {
      const admin = await Admin.create({ adminName, adminEmail, adminPassword });
      const token = adminSignToken(admin);
      return { token, admin };
    },

    addGauge: async (_, { gauge_name, category, current_inventory, inhouse_PN }) => {
      const gauge = await Gauge.create({ gauge_name, category, current_inventory, inhouse_PN });
      return gauge;
    },

    addCategory: async (_, { category_name }) => {
      const category = await Category.create({ category_name });
      return category;
    },

    deleteUser: async (_, { _id: ID }) => {
      await User.deleteOne({_id: ID});
      return ("One user deleted");
    },

    


    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
       
        throw new AuthenticationError('No user found with this email address.');
      }

      const correctPw = await user.isCorrectPassword(password);
      
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      console.log('The current user data is:  ', user);
      console.log('Is this an admin?:  ', user.isAdmin);
      const token = signToken(user);

      return { token, user };
    },


    adminLogin: async (_, { adminEmail, adminPassword }) => {
      const admin = await Admin.findOne({ adminEmail });

      if (!admin) {
        throw new AuthenticationError('No admin found with this email address');
      }

      const correctPw = await admin.isCorrectPassword(adminPassword);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = adminSignToken(admin);

      return { token, admin };
    },




    // addThought: async (parent, { thoughtText }, context) => {
    //   if (context.user) {
    //     const thought = await Thought.create({
    //       thoughtText,
    //       thoughtAuthor: context.user.username,
    //     });

    //     await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $addToSet: { thoughts: thought._id } }
    //     );

    //     return thought;
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
    // addComment: async (parent, { thoughtId, commentText }, context) => {
    //   if (context.user) {
    //     return Thought.findOneAndUpdate(
    //       { _id: thoughtId },
    //       {
    //         $addToSet: {
    //           comments: { commentText, commentAuthor: context.user.username },
    //         },
    //       },
    //       {
    //         new: true,
    //         runValidators: true,
    //       }
    //     );
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
    // removeThought: async (parent, { thoughtId }, context) => {
    //   if (context.user) {
    //     const thought = await Thought.findOneAndDelete({
    //       _id: thoughtId,
    //       thoughtAuthor: context.user.username,
    //     });

    //     await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $pull: { thoughts: thought._id } }
    //     );

    //     return thought;
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
    // removeComment: async (parent, { thoughtId, commentId }, context) => {
    //   if (context.user) {
    //     return Thought.findOneAndUpdate(
    //       { _id: thoughtId },
    //       {
    //         $pull: {
    //           comments: {
    //             _id: commentId,
    //             commentAuthor: context.user.username,
    //           },
    //         },
    //       },
    //       { new: true }
    //     );
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },
  },
};

module.exports = resolvers;
