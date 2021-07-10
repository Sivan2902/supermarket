const express = require("express");
const usersController = require("./Controllers/users-controller");
const usersProducts = require("./Controllers/products-controller");
const usersShoppingCarts = require("./Controllers/shopping_carts-controller");
const usersCartItems = require("./Controllers/cart_items-controller")
const usersPurchases = require("./Controllers/purchases-controller")

const server = express();
const port = process.env.PORT || 3001;
var cors = require("cors");
const errorHandler = require("./Errors/error-handler");
const loginFilter = require('./middleware/login-filter');

// for uploading pictures to folder "uploads"
server.use(express.static('./uploads'));
server.use(cors({ origin: "http://34.65.6.110:4200"}));
server.use(express.static(__dirname));
server.use(express.json());

// every HTTP request will go through this login filter middleware
server.use(loginFilter());

server.use("/users", usersController);
server.use("/products", usersProducts);
server.use("/shopping_carts", usersShoppingCarts);
server.use("/cart_items",usersCartItems);
server.use("/purchases",usersPurchases);
server.use(errorHandler);

server.listen(port, () => console.log("Listening on http://34.65.6.110:" + port));
