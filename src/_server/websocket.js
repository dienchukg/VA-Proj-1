//import * as csv from "csv-parser"
import { parse } from "csv-parse";
import * as fs from "fs"
import { print_clientConnected, print_clientDisconnected } from "./static/utils.js"
// const preprocessing = require("./preprocessing.js")
import { is_below_max_weight, parse_numbers, calc_bmi } from "./preprocessing.js"
import { filterTopRankedGames, selectGamesByCategory, selectGamesByMechanic, in_top_10_popular_categories, in_top_10_popular_mechanics } from "./preprocessing.js";
import { LDA } from "./druidExample.js";

const file_path = "./data/"
const file_name = "boardgames_100.json"



/**
 * Does some console.logs when a client connected.
 * Also sets up the listener, if the client disconnects.
 * @param {*} socket 
 */
export function setupConnection(socket) {
  print_clientConnected(socket.id)

  /**
   * Listener that is called, if client disconnects.
   */
  socket.on("disconnect", () => {
    print_clientDisconnected(socket.id)
  })

  socket.on("getDataByCategory", (obj) => {
    console.log(`Data request with properties ${JSON.stringify(obj)}...`)

    let parameters = obj.parameters

    let jsonArray = []

    // This is reading the .csv file line by line
    // So we can filter it line by line
    // This saves a lot of RAM and processing time
    fs.readFile(file_path + file_name, "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      jsonArray = JSON.parse(data)

      let dataByCategory = selectGamesByCategory(jsonArray, parameters)

      socket.emit("DataByCategory", {
        timestamp: new Date().getTime(),
        data: dataByCategory,
        parameters: parameters,
      })
      console.log("Data by category:", dataByCategory);
    }
    )
  })






  /**
   * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
   * 
   * !!!!! Here an below, you can/should edit the code  !!!!!
   * - you can modify the getData listener
   * - you can add other listeners for other functionalities
   * 
   * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
   */


  /**
   * Listener that is called, if a message was sent with the topic "getData"
   * 
   * In this case, the following is done:
   * - Read in the data (.csv in this case) a a stream
   *      (Stream -> data is read in line by line)
   * - Do data preprocessing while reading in:
   *      - Convert values, that can be represented as numbers to numbers
   *      - Calculate the BMI for every data row (person)
   *      - Filtering: if the row has a value, that contradicts the filtering parameters, data row will be excluded
   *          (in this case: weight should not be larger than the max_weight filter-parameter)
   */
  socket.on("getData", (obj) => {
    console.log(`Data request with properties ${JSON.stringify(obj)}...`)




    let parameters = obj.parameters

    let jsonArray = []

    // This is reading the .csv file line by line
    // So we can filter it line by line
    // This saves a lot of RAM and processing time
    fs.readFile(file_path + file_name, "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      jsonArray = JSON.parse(data)

      let filteredData = applyFilters(jsonArray, parameters);

      console.log("Data:", filteredData);
      //when all data is ready and processed, send it to the frontend of the socket
      socket.emit("freshData", {
        timestamp: new Date().getTime(),
        data: filteredData,
        parameters: parameters,
      })
    })


  })




  socket.on("getLDA", (obj) => {
    console.log(`Data request with properties ${JSON.stringify(obj)}...`)

    let parameters = obj.parameters

    let jsonArray = []
    fs.readFile(file_path + file_name, "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      jsonArray = JSON.parse(data)

      let dataFilter = applyFilters(jsonArray, parameters);
      // Add class in_top_10_cat
      in_top_10_popular_categories(dataFilter);
      in_top_10_popular_mechanics(dataFilter);

      // LDA
      let lda = LDA(dataFilter, parameters);

      socket.emit("getLDA", {
        timestamp: new Date().getTime(),
        data: lda,
        parameters: parameters,
      })

    }
    )
  })


}

function applyFilters(data, filters) {
  let filteredData = data.slice(); // Copy the original data to avoid modifying it directly

  // Apply each filter function
  for (let filterName in filters) {
    if (filters.hasOwnProperty(filterName)) {
      const filterValue = filters[filterName];
      filteredData = applyFilter(filteredData, filterName, filterValue);
    }
  }

  return filteredData;
}

function applyFilter(data, filterName, filterValue) {
  switch (filterName) {
    case "category":
      return selectGamesByCategory(data, filterValue);
    case "top_rank":
      return filterTopRankedGames(data, filterValue);
    // Add more cases for additional filters as needed
    case "mechanic":
      return selectGamesByMechanic(data, filterValue);
    default:
      return data;
  }
}