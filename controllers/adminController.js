const { catchAsyncErrors } = require("../middlewares/catchAsyncError")
const adminModel = require("../models/adminModel")
const {sendtoken} = require("../utils/SendToken");
const ErrorHandler = require("../utils/ErrorHandler")
const clothModel = require("../models/clothModel")


exports.homepage = catchAsyncErrors(async(req, res, next) =>{
    res.json({message: "Homepage"})
})

exports.currentAdmin = catchAsyncErrors(async(req,res,next) =>{
  const Admin = await adminModel.findById(req.id).exec();
  res.json(Admin);
})

exports.adminSignup = catchAsyncErrors(async(req, res, next) =>{
    const Admin = await new adminModel(req.body).save();
    sendtoken(Admin, 201, res)
});

exports.adminSignin = catchAsyncErrors(async(req, res, next) =>{
    const Admin = await adminModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!Admin) {
    next(new ErrorHandler("Admin with this email address not found"));
  }

  const isMatch = Admin.comparepassword(req.body.password);
  if (!isMatch) {
    next(new ErrorHandler("Wrong Credentials", 404));
  }

  sendtoken(Admin, 201, res);
})

exports.createOrder = catchAsyncErrors(async(req, res, next) =>{
    const Order = await new clothModel(req.body).save()

    const Admin = await adminModel.findByIdAndUpdate(req.id, { $push: { createdOrders: Order._id } },
        { new: true }).exec()
    if(!Admin){
      next ( new ErrorHandler("Admin not found"))
    }
    res.status(201).json({message: "order created"})
})

exports.findCloth = catchAsyncErrors( async ( req, res, next)=>{
  const Cloth = await clothModel.findById(req.params.id).exec()
  if(!Cloth){
    return next(
      next( new ErrorHandler("Cloth not found", 404))
    )
  }
  res.status(201).json({message:"Cloth found"})
})

exports.allClothes = catchAsyncErrors(async( req, res , next) =>{
   const allClothes = await adminModel.findById(req.id).select('createdOrders').populate('createdOrders').exec()
   res.status(201).json(allClothes)
})

exports.updateCloth = catchAsyncErrors(async( req, res, next) =>{
  const Cloth = await clothModel.findByIdAndUpdate(req.params.id, req.body).exec()
  if(!Cloth){
    return next(
      next( new ErrorHandler("Cloth not found", 404))
    )
  }

  res.status(201).json({message:"Cloth updated"});
})

exports.deleteCloth = catchAsyncErrors(async( req, res, next) =>{
  const Cloth = await clothModel.findByIdAndDelete(req.params.id).exec();
  if(!Cloth){
    return next(
      next( new ErrorHandler("Cloth not found", 404))
    )
  }

  res.status(201).json({message:"Clothe deleted"});
})