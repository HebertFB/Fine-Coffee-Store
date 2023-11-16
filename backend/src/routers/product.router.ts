import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Product, ProductModel } from '../models/product.model';
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from '../constants/http_status';
const router = Router();


router.get("/", asyncHandler(
    async (req, res) => {
        const products = await ProductModel.find();
        res.send(products);
    }
))

router.post('/create-product', asyncHandler(
    async (req, res) => {
        const { name, price, description, tags, imageUrl,
            origins, preparationTime } = req.body;

        const product = await ProductModel.findOne({ name });
        if (product) {
            res.status(HTTP_BAD_REQUEST).send(`O produto ${name} já existe!`);
            return;
        }

        const newProduct = {
            name,
            price,
            glassSize: ["Pequeno", "Médio", "Grande"],
            description,
            tags,
            imageUrl,
            origins,
            preparationTime,
        }

        try {
            const dbProduct = await ProductModel.create(newProduct);
            res.send(generateResponse(dbProduct));
        } catch (error) {
            res.status(HTTP_BAD_REQUEST).send(error || 'Erro ao criar o produto.');
        }
    }
));

router.put('/update/:id', asyncHandler(
    async (req, res) => {
        const productId = req.params.id;
        const { name, price, description, tags, imageUrl,
            origins, preparationTime } = req.body;

        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(HTTP_NOT_FOUND).send('Produto não encontrado!');
                return;
            }

            product.name = name;
            product.price = price;
            product.description = description;
            product.tags = tags;
            product.imageUrl = imageUrl;
            product.origins = origins;
            product.preparationTime = preparationTime;

            await product.save();
            res.send(generateResponse(product));
        } catch (error) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
    }
));

router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        const productId = req.params.id;
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(HTTP_NOT_FOUND).send('Produto não encontrado!');
                return;
            }

            await ProductModel.deleteOne({ _id: productId });
            res.send(generateResponse(product));
        } catch (error) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
    }
));

router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const products = await ProductModel.find({ name: { $regex: searchRegex } })
        res.send(products);
    }
))

router.get("/tags", asyncHandler(
    async (req, res) => {
        const tags = await ProductModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 });

        const all = {
            name: 'Tudo',
            count: await ProductModel.countDocuments()
        }

        tags.unshift(all);
        res.send(tags);
    }
))

router.get("/tag/:tagName", asyncHandler(
    async (req, res) => {
        const products = await ProductModel.find({ tags: req.params.tagName })
        res.send(products);
    }
))

router.get("/:productId", asyncHandler(
    async (req, res) => {
        const product = await ProductModel.findById(req.params.productId);
        res.send(product);
    }
))

const generateResponse = (product: Product) => {
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        glassSize: product.glassSize,
        description: product.description,
        tags: product.tags,
        imageUrl: product.imageUrl,
        origins: product.origins,
        preparationTime: product.preparationTime,
    };
}


export default router;