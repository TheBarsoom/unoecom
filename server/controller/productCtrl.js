const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { valdiateMongoDbId } = require("../utils/validateMongodbid");
const crypto = require("crypto");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = await slugify(req.body.title);
    }
    const crypt = crypto.randomUUID();
    const newSlug = `${req.body.slug} ${crypt}`;
    const product = await Product.create({ ...req.body, slug: newSlug });
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    //GET DATA OLD METHOD
    // const getAllProduct = await Product.find();
    // res.json({ message: `All Product:`, getAllProduct });
    //FILTERING
    //localhost:5000/api/product/all-product?price[gte]=2500&price[lte]=2500
    // localhost:5000/api/product/all-product?price[gte]=2500&brand=ULEFON
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeFields = [`page`, `sort`, `limit`, `fields`];
    excludeFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, req.query, excludeFields);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));
    // console.log(query);

    //SORTING
    //localhost:50  00/api/product/all-product?sort=category,brand
    //localhost:5000/api/product/all-product?sort=-category,-brand asc/desc

    if (req.query.sort) {
      console.log(req.query.sort);
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Limiting the fields
    //localhost:5000/api/product/all-product?fields=title,price,category
    if (req.query.fields) {
      console.log(req.query.fields);
      const fields = req.query.fields.split(",").join(" ");
      console.log(req.query.fields);
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    //localhost:5000/api/product/all-product?page=1&limit=4
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error(`This page does not exists`);
    }

    const product = await query;
    res.json({ message: `All Product:`, product });
  } catch (error) {
    throw new Error(error);
  }
});

const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await valdiateMongoDbId(id);
  try {
    const product = await Product.findById({ _id: id });
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await valdiateMongoDbId(id);

  try {
    const deletedProduct = await Product.findByIdAndDelete({ _id: id });
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAllProduct = asyncHandler(async (req, res) => {
  try {
    const allDeletedUser = await Product.deleteMany();
    res.json({
      message: `Success deleted all user here is list:`,
      allDeletedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  if (req.body.title) {
    req.body.slug = await slugify(req.body.title);
  }
  const { id } = req.params;
  await valdiateMongoDbId(id);

  console.log(`Put User Controller`);
  // console.log(id);
  console.log(req.user);
  try {
    //   const  updatedUser= await User.findByIdAndUpdate({_id:id},{firstname:req?.body?.firstname,lastname:req?.body?.lastname,email:req?.body?.email,mobile:req?.body?.mobile},{new:true,});

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, slug: req.body.slug },
      {
        new: true,
      }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getAllProduct,
  getOneProduct,
  deleteProduct,
  updateProduct,
  deleteAllProduct,
};
