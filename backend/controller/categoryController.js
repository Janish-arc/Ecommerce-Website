import handleError from "../helper/handleError.js";
import Category from "../models/categorySchema.js"
import {v2 as cloudinary} from "cloudinary"
import Product from "../models/productSchema.js"

//Get All Category
export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({createdAt: -1});
    const countCategories = await Promise.all(
      categories.map(async (cat) => {
      const productCount = await Product.countDocuments({
        category: cat._id
      })
        return {
          ...cat._doc, productCount
        }
      })
    )
    res.status(200).json({ success: true,  categories: countCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const myCloud = await cloudinary.uploader.upload(image, {
      folder:"ECOM_AVATAR",
      width:1000,
      crop: "scale",
      quality: "auto"
    })
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }
    const newCategory = await Category.create({
      name,
      image: {
        public_id : myCloud.public_id,
        url: myCloud.secure_url
      }
    });
    res.status(201).json({
      success: true,
      category: newCategory
    });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//Delete Category
export const deleteCategory = async(req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }
    await category.deleteOne()
    return res.status(200).json({success: true, message: "Category deleted successfully"})
}

//Edit Category
// export const editCategory = async(req, res, next) => {
//   const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
//   const myCloud = await cloudinary.uploader.upload(image, {
//       folder:"ECOM_AVATAR",
//       width:1000,
//       crop: "scale",
//       quality: "auto"
//     })
//   try{
//   if(!category){
//     return next(new handleError("Category not found", 404))
//   }
//   return res.status(200).json({success: true, category})
//   }catch(error){
//     return res.status(400).json({success: false, error})
//   }
// }
export const editCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      })
    }
    // update name
    category.name = req.body.name
    // if new image is provided
    if (req.body.image) {
      // upload new image
     const myCloud = await cloudinary.uploader.upload(req.body.image, {
      folder:"ECOM_AVATAR",
      width:1000,
      crop: "scale",
      quality: "auto"
    })
      category.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    await category.save()
    res.status(200).json({
      success: true,
      category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}