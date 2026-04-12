import Product from "../models/productSchema.js"
import handleError from "../helper/handleError.js"
import Apihelper from "../helper/Apihelper.js"
import {v2 as cloudinary} from "cloudinary"

//Product creation
// export const addProducts = async (req, res) => {
//     // console.log(req.body) 
//     const {name, price, MRP, description, detailedDescription, stock, category, image} = req.body
//     // req.body.user = req.user.id
//      const myCloud = await cloudinary.uploader.upload(image, {
//             folder: "ECOM_AVATAR",
//             width: 1000,
//             crop: "scale",
//             quality: "auto"
//         })
//     const newProduct = await Product.create({name, price, MRP, description, detailedDescription, stock, category, 
//         image:[{
//             public_id: myCloud.public_id,
//             url: myCloud.secure_url
//         }], user: req.user.id})
//     console.log(newProduct)
//     return res.status(201).send({msg:"Product has been created and added successfully"})
// } 


export const addProducts = async (req, res) => {
  try {
    const {
      name,
      price,
      MRP,
      description,
      detailedDescription,
      stock,
      category,
      image
    } = req.body

    // 🔥 Handle single or multiple images
    let images = []

    if (typeof image === "string") {
      images.push(image)
    } else {
      images = image
    }

    // 🔥 Upload all images to Cloudinary
    const imagesLinks = []

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "ECOM_AVATAR",
        width: 1000,
        crop: "scale",
        quality: "auto"
      })

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      })
    }

    // 🔥 Create product
    const newProduct = await Product.create({
      name,
      price: Number(price), // safety
      MRP: Number(MRP),
      description,
      detailedDescription,
      stock,
      category,
      image: imagesLinks, // ✅ array of images
      user: req.user.id
    })

    return res.status(201).json({
      success: true,
      message: "Product has been created successfully",
      product: newProduct
    })

  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error)

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//Update Product
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id

    let product = await Product.findById(id)
    if (!product) {
      return next(new handleError("Product not found", 404))
    }

    // ✅ Update fields safely
    product.name = req.body.name ?? product.name
    product.price = req.body.price ? Number(req.body.price) : product.price
    product.description = req.body.description ?? product.description
    product.detailedDescription = req.body.detailedDescription ?? product.detailedDescription
    product.stock = req.body.stock ?? product.stock
    product.category = req.body.category ?? product.category

    // 🔥 HANDLE MULTIPLE IMAGES
    if (req.body.image) {
      let images = []

      if (typeof req.body.image === "string") {
        images.push(req.body.image)
      } else {
        images = req.body.image
      }

      const imagesLinks = []

      for (let i = 0; i < images.length; i++) {
        // ✅ Only upload new base64 images
        if (images[i].startsWith("data:image")) {
          const result = await cloudinary.uploader.upload(images[i], {
            folder: "ECOM_AVATAR"
          })

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
          })
        } else {
          // ✅ Keep existing image (URL)
          imagesLinks.push({
            public_id: "existing",
            url: images[i]
          })
        }
      }

      product.image = imagesLinks
    }

    product.user = product.user || req.user?._id

    await product.save()

    return res.status(200).json({
      success: true,
      product
    })

  } catch (error) {
    console.log("UPDATE ERROR:", error)

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//Get all Products
export const getAllProducts =async (req, res, next) => {
    const productsPerPage = 8
    const apihelper = new Apihelper(Product.find(), req.query).search().filter()
    const filteredquery = apihelper.query.clone()
    const productCount = await filteredquery.countDocuments()
    const totalPages = Math.ceil(productCount / productsPerPage)
    const page = Number(req.query.page) || 1

    if(totalPages>0 && page>totalPages){
        return next(new handleError("This page doesn't exist", 404))
    }
    const {sort} = req.query  
    let sortOption = {}
    if (sort === "asc_price") sortOption = { price: 1 }
    else if (sort === "desc_price") sortOption = { price: -1 }
    else if (sort === "newest") sortOption = { createdAt: -1 }
    else if (sort === "rating") sortOption = { rating: -1 }
   
    apihelper.query = apihelper.query.sort(sortOption)

    apihelper.pagination(productsPerPage)
    const Products = await apihelper.query.populate("category", "name")  
    if(!Products || Products.length===0){
        return next(new handleError("Product not found", 404))
    }
   
    return res.status(200).json({success: true, 
        Products, productCount, totalPages, productsPerPage, currentPage : page})
}

//Get Latest Products
export const getLatestProducts = async (req, res, next) => {
    const products = await Product.find().sort({createdAt: -1 , _id: -1 }).limit(8)
    return res.status(200).json({success: true, products})
}

//Get Single Product
export const getSelectedProduct = async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findById(id).populate("category", "name")
    if(!product){
        // return res.status(400).json({success: false, message:"Product not Found"})
        return next(new handleError("Product not found", 404))
    }
    return res.status(200).json({success:true, product})
}

//Delete a Product
export const deleteProduct = async (req, res, next) => {
    const id = req.params.id
    const product = await Product.findByIdAndDelete (id)
    if(!product){
        // return res.status(400).send({success: false, message: "Product not Found"})
        return next(new handleError("Product not found", 404))
    }
    return res.status(203).send({success: true, message: "Product deleted"})
}

//Product Review
export const productReview = async (req, res, next) => {
    const {rating, comment, productId} = req.body
    const review = {
            user : req.user.id,
            avatar : req.user.avatar.url,
            name : req.user.name,
            rating : Number(rating),
            comment
    }
    const product = await Product.findById(productId)
    if(!product){
        return next(new handleError("Product is not exist", 404))
    }
    const reviewExists = product.reviews.find((review) => review.user == req.user.id)
    if(reviewExists){
        product.reviews.forEach((review) => {
            if(review.user.toString() === req.user.id.toString()){
                review.rating = rating,
                review.comment = comment
            }
        })
    }
    else{
        product.reviews.push(review)
    }
    product.noOfReviews = product.reviews.length
    let sum = 0
    product.reviews.forEach((review) => {
        sum = sum + review.rating
    })
    product.rating = product.reviews.length > 0 ? sum / product.reviews.length: 0
    await product.save({validateBeforeSave : false})
    return res.status(200).json({success : true, product})
}    

//View Review
export const viewReview = async (req, res, next) => {
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new handleError("Product is not found", 404))
    }
    res.status(200).json({success: true, reviews: product.reviews})   
}

//Delete Review
export const deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new handleError("Product not exist", 404))
    }
    const reviews = product.reviews.filter((review) => review._id.toString() !== req.query.id.toString())
    const noOfReviews = reviews.length
    let sum = 0
    reviews.forEach((review) => {
        sum = sum + review.rating
    })
    const rating = reviews.length > 0 ? sum / reviews.length: 0
    await Product.findByIdAndUpdate(req.query.productId, {reviews, rating, noOfReviews},
         {new : true, runValidators: true})
    return res.status(200).json({success : true, message: "Review deleted successfully"})
}

//Get all Products By Admin
export const getProductsByAdmin = async (req, res, next) => {
    const productsPerPage = 10;
    const apihelper = new Apihelper(Product.find(), req.query).search().filter()
    const filteredquery = apihelper.query.clone()
    const productsCount = await filteredquery.countDocuments()
    const totalPages = Math.ceil(productsCount/ productsPerPage)
    const page = Number(req.query.page || 1)
   
    if(totalPages>0 && page>totalPages){
        return next(new handleError("This page doesn't exist", 404))
    }
    apihelper.pagination(productsPerPage)
    const products = await apihelper.query.sort({createdAt:-1})
     console.log(products)
    return res.status(200).json({success:true , products, productsPerPage, productsCount,
         totalPages})
}