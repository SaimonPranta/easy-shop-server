const product_collection = require("../../db/schemas/product_schema")
const fs = require("fs-extra");
const path = require("path");
const { productDirectory } = require("../../constants/storageDirectory");
exports.product = async (req, res) => {
    try {
        const data = await product_collection.find()
        if (data.length) {
            res.status(200).json({
                data: data,
                message: "sucessfully provided all product"
            })
        } else {
            res.status(412).json({
                message: "failed to load product"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "failed to load product"
        })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const { id } = await req.params;
        if (!id) {
            return res.status(500).json({
                failed: "failed to provide product"
            })
        }
        const data = await product_collection.findOne({ _id: id })
        if (data._id) res.status(200).json({
            sucess: "sucessfully get product",
            data: data
        })

    } catch (error) {
        res.status(500).json({
            failed: "failed to provide product"
        })
    }
}

exports.addProduct = async (req, res) => {
    try {
        const image = req.files.img;
        const { title, dis, price, discount, rating, detailsArray, viewAs } = await JSON.parse(req.body.data);

        if (!title && !dis && !price && !discount && !image && !rating && !detailsArray) {
            console.log("enter to failed data")
            return res.status(417).json({
                message: "failed to add product"
            })
        }
        if (
            image.mimetype !== "image/jpg" &&
            image.mimetype !== "image/png" &&
            image.mimetype !== "image/jpeg" &&
            id
        ) {
            res.status(500).send({ failed: "Only .jpg .png or .jpeg format allowed !" })
        } else if (image.size >= "1500012") {
            res.status(500).send({ failed: "Image Size are too large !" })
        } else {
            const extention = await image.mimetype.split("/")[1];
            image.name = await image.name.split(".")[0] + Math.floor(Math.random() * 10) + Date.now() + "." + extention;
            const productInfo = await {
                title,
                dis,
                price,
                discount,
                img: image.name,
                rating,
                detailsArray
            }
            if (viewAs) productInfo.viewAs = await viewAs;

            const documents = await new product_collection(productInfo);
            const data = await documents.save();
            console.log(data)

            if (data._id) {
                await image.mv(`${productDirectory()}/${image.name}`);

                res.status(201).json({
                    data: data,
                    message: "sucessfully added product"
                })
            } else {
                res.status(417).json({
                    message: "failed to add product"
                })
            }
        }

    } catch (error) {
        // console.log(error)
        res.status(417).json({
            message: "failed to add product"
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = await req.params;
        // console.log(id)
        if (id) {
            const data = await product_collection.findOneAndDelete({ _id: id })
            console.log("This is Data of delete product", data)
            if (!data._id) {
                return res.status(200).json({
                    failed: "failed to deleted product"
                })
            }
            await fs.removeSync(`${productDirectory()}/${data.img}`)
            res.status(200).json({
                sucess: "sucessfully deleted product",
                data: data
            })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({
            failed: "failed to deleted product"
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { title, dis, price, discount, img, rating, detailsArray, viewAs, _id } = await JSON.parse(req.body.data);
        const isImageExist = req.files ? true : false;
        const productInfo = await {
            title,
            dis,
            price,
            discount,
            rating,
            detailsArray
        }
        console.log(isImageExist)

        if (_id) {
            if (isImageExist) {
                const image = req.files.newImg;
                if (
                    image.mimetype !== "image/jpg" &&
                    image.mimetype !== "image/png" &&
                    image.mimetype !== "image/jpeg"
                ) {
                    res.status(500).send({ failed: "Only .jpg .png or .jpeg format allowed !" })
                } else if (image.size >= "1500012") {
                    res.status(500).send({ failed: "Image Size are too large !" })
                } else {
                    const extention = await image.mimetype.split("/")[1];
                    image.name = await image.name.split(".")[0] + Math.floor(Math.random() * 10) + Date.now() + "." + extention;

                    productInfo["img"] = await image.name;

                    const data = await product_collection.findOneAndUpdate({
                        _id
                    },
                        {
                            ...productInfo
                        })
                    if (!data._id) {
                        return res.status(200).json({
                            failed: "failed to deleted product"
                        })
                    }
                    console.log(data)
                    await image.mv(`${productDirectory()}/${image.name}`);
                    await fs.removeSync(`${productDirectory()}/${data.img}`)

                    res.status(200).json({
                        sucess: "sucessfully updated product",
                        data: data
                    })
                }
            } else {
                console.log("ther4e")
                const data = await product_collection.findOneAndUpdate({
                    _id
                },
                    {
                        ...productInfo
                    },
                    {
                        new: true
                    })
                if (!data._id) {
                    return res.status(200).json({
                        failed: "failed to deleted product"
                    })
                }
                res.status(200).json({
                    sucess: "sucessfully updated product",
                    data: data
                })
            }

        } else {
            console.log("ok")
            res.status(200).json({
                failed: "failed to update product"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({
            failed: "failed to update product"
        })
    }
}