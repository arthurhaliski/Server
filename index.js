const { ApolloServer, gql } = require('apollo-server');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const express = require('express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();


// Read and parse the schema
const typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.graphql'), { encoding: 'utf-8' }));
const schema = makeExecutableSchema({ typeDefs });

// Generate resolver skeletons
const generateResolverSkeletons = (schema) => {
  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const subscriptionType = schema.getSubscriptionType();

  const resolvers = {};

  // Queries
  if (queryType) {
    resolvers.Query = {};
    const fields = queryType.getFields();
    for (const fieldName in fields) {
      resolvers.Query[fieldName] = () => {
        console.log(`Query resolver for ${fieldName} not implemented`);
        return null;
      };
    }
  }

  // Mutations
  if (mutationType) {
    resolvers.Mutation = {};
    const fields = mutationType.getFields();
    for (const fieldName in fields) {
      resolvers.Mutation[fieldName] = () => {
        console.log(`Mutation resolver for ${fieldName} not implemented`);
        return null;
      };
    }
  }

  // Subscriptions
  if (subscriptionType) {
    resolvers.Subscription = {};
    const fields = subscriptionType.getFields();
    for (const fieldName in fields) {
      resolvers.Subscription[fieldName] = {
        subscribe: () => {
          console.log(`Subscription resolver for ${fieldName} not implemented`);
          return pubsub.asyncIterator(fieldName); // Assuming you have a PubSub instance
        },
      };
    }
  }

  return resolvers;
};

const resolvers = generateResolverSkeletons(schema);

  const app = express();
  const httpServer = createServer(app);

// Create the ApolloServer instance
const apolloServer = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  // No need to use ApolloServerPluginDrainHttpServer when using apollo-server directly
});

// Remove the async function wrapper and the await keyword
// Start the server using listen() method
apolloServer.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});