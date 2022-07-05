const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID } = graphql
const stockData = require("./stockdata.json")
var app = express();
const fs = require('fs')

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

// Uncomment for logging
// const loggingMiddleware = (req, res, next) => {
//     fs.appendFileSync("logs.txt" , `${new Date().toLocaleString("en-GB")} req from ip: ${req.ip} \n`)
//     console.log('ip:', req.ip);
//     next();
//   }

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllStocks: {
            type: new GraphQLList(StockType),
            description: 'Returns all stocks',
            resolve(parent, args) {
                // DB GET ALL *, FIND etc..
                return stockData
            }
        },
        getStock: {
            type: new GraphQLList(Instrument_info),
            description: 'Returns specific stock',
            args: { id: { type: GraphQLInt }},
            resolve(parent, args) {
                const findStock = stockData.find(stock => stock.instrument_info.instrument_id === args.id)
                // const findStock = stockData.find(Instrument_info, args.id)
                return findStock
            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery})
// Uncomment for logging
// app.use(loggingMiddleware);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
