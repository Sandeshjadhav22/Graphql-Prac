const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const {TODOS} = require('./todo')
const {USERS} = require('./user')


async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
        type User {
        id: ID!
        name : String!
        username : String!
        email : String!
        phone : String!
        website : String!
        }    

        type Todo {
        id : ID!
        title : String!
        completed : Boolean
        user: User
        }
       
        type Query {
        getTodos : [Todo]
        getAllUser : [User]
        getUser(id: ID!): User
        }

        `,
    resolvers: {
      Todo: {
        user:  (todo) =>USERS.find((e) => e.id === todo.id)
      },
      Query: {
        getTodos: () => TODOS,
        getAllUser: () => USERS,
        getUser: async (parent, { id }) => USERS.find((e) => e.id === id)
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server started at PORT 8000"));
}

startServer();
