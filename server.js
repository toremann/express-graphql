const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = graphql
const fakeData = require("./data.json")
var app = express();

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: BelongsToId },
        firstName: { type: GraphQLString }
    })
})

const BelongsToId = new GraphQLObjectType ({
    name: "BelongsToId",
    fields: () => ({
        idnumber: { type: GraphQLInt }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLInt }},
            resolve(parent, args) {
                // DB GET ALL *, FIND etc..
                return fakeData
            }
        },
        // getAllUsers: {
        //     type: new GraphQLList(UserType),
        //     args: { id: { type: GraphQLInt }},
        //     resolve(parent, args) {
        //         // DB GET ALL *, FIND etc..
        //         return fakeData
        //     }
        // }
    }
})

const schema = new GraphQLSchema({query: RootQuery})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');


// {
//     getAllUsers {
//       id { idnumber }
//     }
//   }