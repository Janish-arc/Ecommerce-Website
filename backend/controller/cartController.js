import Cart from "../models/cartSchema.js"

//Add to Cart
export const addToCart = async(req, res) => {
    const {productId, quantity} = req.body
    const userId = req.user.id
    const qty = Number(quantity)
    let cart = await Cart.findOne({user: userId})
    if(!cart){
        cart = await Cart.create({
            user : userId,
            items : [{product: productId, quantity}]
        })
    }else{
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId.toString()
        )
    if(itemIndex > -1){
        cart.items[itemIndex].quantity += qty
    }else{
        cart.items.push({product: productId, quantity: qty})
    }
    await cart.save()
    }
    res.status(200).json({success: true, cart})
}

//Get Cart Details
export const getCart = async (req, res) => {
      if(!req.user){
        return res.status(401).json({
            success:false,
            message:"Please login"
        })
    }
    const cart = await Cart.findOne({ user : req.user.id}).populate("items.product", "name price image stock desciption detailedDescription")
    if(!cart){
        return res.status(200).json({success: true, cart:{items: []}})
    }
    res.status(200).json({success: true, cart})
}

//Remove Products in Cart
export const removeCartProduct = async(req, res) => {
    const {productId} = req.params
    const cart = await Cart.findOne({user: req.user.id})
    if(!cart){
    return res.status(404).json({
        success:false,
        message:"Cart not found"
    })
    }
    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    )
    await cart.save()
    res.status(200).json({success: true, cart})
}