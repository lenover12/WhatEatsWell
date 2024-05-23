import Wholefoods from "../models/wholefoods.js";
import Products from "../models/products.js";

export default class FoodsController {
  static async apiGetAllFoodsNames(req, res, next) {
    try {
      const wholefoods = await Wholefoods.find({}, { food_name: 1 });
      const products = await Products.find({}, { food_name: 1 });
      
      const response = {
        wholefoodsNames: wholefoods.map(wholefood => wholefood.food_name),
        productsNames: products.map(product => product.food_name)
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
