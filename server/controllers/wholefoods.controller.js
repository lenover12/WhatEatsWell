import Wholefoods from "../models/wholefoods.js";

export default class WholefoodsController {
  // API endpoint handler for retrieving all wholefoods
  static async apiGetAllWholefoodsNames(req, res, next) {
    try {
      // Retrieve wholefoods names
      const wholefoods = await Wholefoods.find({}, { food_name: 1 });
  
      // Prepare the response
      const response = {
        wholefoodsNames: wholefoods.map(wholefood => wholefood.food_name)
      };
  
      // Send the response
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
