const { gql } = require('apollo-server-express');

const typeDefs = gql`
 type Category {
    _id: ID
    category_name: String
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    isAdmin: Boolean!
  }

  type Admin{
    _id: ID
    adminName: String!
    adminEmail: String!
    adminPassword: String!
  }

  type Gauge {
    _id: ID
    gauge_name: String
    category: Category
    current_inventory: Int!
    quantity_borrowed: Int
    inhouse_PN:  String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type AuthAdmin {
    token: ID!
    admin: Admin
  }

  type Query {
    users: [User]
    user(username: String!): User
    admins: [Admin]
    admin(adminName: String!): Admin
    gauges: [Gauge]
    categories: [Category]
    gauge(gaugeId: ID!): Gauge
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, isAdmin: Boolean!): Auth
    login(email: String!, password: String!): Auth 
    addAdmin(adminName: String!, adminEmail: String!, adminPassword: String!): AuthAdmin
    adminLogin(adminEmail: String!, adminPassword: String!): AuthAdmin
    addGauge(gauge_name: String!, category: ID!, current_inventory: Int!, inhouse_PN: Int) : Gauge
    addCategory(category_name: String!) : Category
    deleteUser(_id: ID!): User

  }
`;

module.exports = typeDefs;
