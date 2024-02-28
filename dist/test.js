"use strict";

var _require = require('apollo-server'),
  ApolloServer = _require.ApolloServer,
  gql = _require.gql;
var _require2 = require('subscriptions-transport-ws'),
  SubscriptionServer = _require2.SubscriptionServer;
var _require3 = require('graphql'),
  execute = _require3.execute,
  subscribe = _require3.subscribe;
var _require4 = require('@graphql-tools/schema'),
  makeExecutableSchema = _require4.makeExecutableSchema;
var _require5 = require('http'),
  createServer = _require5.createServer;
var express = require('express');
var _require6 = require('apollo-server-core'),
  ApolloServerPluginDrainHttpServer = _require6.ApolloServerPluginDrainHttpServer;
var _require7 = require('ws'),
  WebSocketServer = _require7.WebSocketServer;
var fs = require('fs');
var path = require('path');
var _require8 = require('graphql-subscriptions'),
  PubSub = _require8.PubSub;
var pubsub = new PubSub();

// Read and parse the schema
var typeDefs = gql(fs.readFileSync(path.join(__dirname, 'schema.graphql'), {
  encoding: 'utf-8'
}));
var schema = makeExecutableSchema({
  typeDefs: typeDefs
});

// Generate resolver skeletons
var generateResolverSkeletons = function generateResolverSkeletons(schema) {
  var queryType = schema.getQueryType();
  var mutationType = schema.getMutationType();
  var subscriptionType = schema.getSubscriptionType();
  var resolvers = {};

  // Queries
  if (queryType) {
    resolvers.Query = {};
    var fields = queryType.getFields();
    var _loop = function _loop(fieldName) {
      resolvers.Query[fieldName] = function () {
        console.log("Query resolver for ".concat(fieldName, " not implemented"));
        return null;
      };
    };
    for (var fieldName in fields) {
      _loop(fieldName);
    }
  }

  // Mutations
  if (mutationType) {
    resolvers.Mutation = {};
    var _fields = mutationType.getFields();
    var _loop2 = function _loop2(_fieldName) {
      resolvers.Mutation[_fieldName] = function () {
        console.log("Mutation resolver for ".concat(_fieldName, " not implemented"));
        return null;
      };
    };
    for (var _fieldName in _fields) {
      _loop2(_fieldName);
    }
  }

  // Subscriptions
  if (subscriptionType) {
    resolvers.Subscription = {};
    var _fields2 = subscriptionType.getFields();
    var _loop3 = function _loop3(_fieldName2) {
      resolvers.Subscription[_fieldName2] = {
        subscribe: function subscribe() {
          console.log("Subscription resolver for ".concat(_fieldName2, " not implemented"));
          return pubsub.asyncIterator(_fieldName2); // Assuming you have a PubSub instance
        }
      };
    };
    for (var _fieldName2 in _fields2) {
      _loop3(_fieldName2);
    }
  }
  return resolvers;
};
var resolvers = generateResolverSkeletons(schema);
var app = express();
var httpServer = createServer(app);

// Create the ApolloServer instance
var apolloServer = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
  })
  // No need to use ApolloServerPluginDrainHttpServer when using apollo-server directly
});

// Remove the async function wrapper and the await keyword
// Start the server using listen() method
apolloServer.listen({
  port: 4000
}).then(function (_ref) {
  var url = _ref.url;
  console.log("\uD83D\uDE80 Server ready at ".concat(url));
});