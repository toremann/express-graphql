const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = graphql
const stockData = require("./stockdata.json")
var app = express();

const StockType = new GraphQLObjectType({
    name: "Stock",
    fields: () => ({
        instrument_info: { type: Instrument_info },
        market_info: { type: Market_info }
    })
})

const Instrument_info = new GraphQLObjectType ({
    name: "InstrumentInfo",
    fields: () => ({
        instrument_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        long_name: { type: GraphQLString },
        symbol: { type: GraphQLString }
    })
})

const Market_info = new GraphQLObjectType ({
    name: "MarketInfo", 
    fields: () => ({
        market_id: { type: GraphQLInt }
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllStocks: {
            type: new GraphQLList(StockType),
            args: { id: { type: GraphQLInt }},
            resolve(parent, args) {
                // DB GET ALL *, FIND etc..
                return stockData
            }
        },
        getStock: {
            type: new GraphQLList(StockType),
            args: { id: { type: GraphQLInt }},
            resolve(parent, args) {
                const stock = args.id
                const findStock = stockData.find(StockType, { id })
                return findStock 
            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
