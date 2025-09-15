const { prisma } = require("../utils/PrismaClient")
const { redis, clearCache } = require("../utils/redisClient")


exports.createProducts = async (req, res, next) => {
    try {

        const { name, description, price, currency, quantity, active, categoryId } = req.body
        // console.log(typeof active)
        if (!name || !description || !price || !currency || !quantity || !(typeof active === 'boolean') || !categoryId)
            return res.status(429).json({ message: "All Fields are required", status: false })
        let check = await prisma.product.findUnique({ where: { name } })
        if (check)
            return res.status(409).json({ message: `product with name: ${name} already exist`, status: false })

        check = await prisma.product.create(
            {
                data: {
                    name,
                    description,
                    price: parseFloat(price),
                    currency,
                    quantity: Number(quantity),
                    active,
                    categoryId
                }
            }
        )

        if (!check)
            return res.status(201).json({ message: "Server error product is not created try again in sometime", status: false })
        else {
            await clearCache('product:offset:*')
            let count = await redis.get('count:product')
            if (!count) {
                count = await redis.set("count:product", JSON.stringify(await prisma.product.count(), "Ex", 60 * 60 * 1))
            }
            else {
                count = await redis.incr("count:product")
                console.log(count)
            }
            return res.status(201).json({ message: "data created succesfully !", data: check, status: true })
        }

    }
    catch (err) {
        console.log(err)
        next()
    }
}


exports.createMultipleProduct = async (req, res, next) => {
    try {

        const { data } = req.body
        if (!(data.length > 0) || !(checkName))
            return res.status(429).json({ message: "Category Name is Required", status: false });
        let addProduct = await prisma.product.createMany({ data, skipDuplicates: true })

        if (!addProduct)
            return res.status(500).json({ mesage: "Some server side error try in sometime", status: false })

        clearCache("product:offset:*")
        let count = await redis.get('count:product')
        if (!count) {
            count = await redis.set("count:product", JSON.stringify(await prisma.product.count(), "Ex", 60 * 60 * 1))
        }
        else {
            count = await redis.incr("count:product")
            console.log(count)
        }
        return res.status(201).json({ message: "Product Created Succesfully !", data: data, status: true });
    }
    catch (err) {
        console.log(err)
        next()
    }
}


exports.getProductById = async (req, res, next) => {
    try {

        const { id } = req.params
        if (!id)
            return res.status(429).json({ message: "id field is required", status: false })
        let check = await redis.get(`product:${id}`)
        if (check)
            return res.status(404).json({ message: "product found succesfully ", data: JSON.parse(check), status: true })

        check = await prisma.product.findUnique({ where: { id: Number(id) } })
        if (!check)
            return res.status(500).json({ message: "no product with the id is present", status: false })
        await redis.set(`product:${id}`, JSON.stringify(check), "EX", 60 & 60 * 1)
        return res.status(200).json({ mesage: "product found succesfully ", data: check, status: true })
    }
    catch (err) {
        console.log(err)
        next()
    }
}


exports.getProducts = async (req, res, next) => {
    try {
        const { offset, limit = 10 } = req.query
        const pattern = `product:offset:${offset}:limit:${limit}`
        if (!offset)
            return res.status(429).json({ message: "Offset Query parameter is required !", status: false })
        let check = await redis.get(pattern)
        let checkCount = await redis.get('count:product')
        if (check && checkCount) {

            check = {
                data: [...JSON.parse(check)],
                pagination: {
                    total: checkCount,
                    offset: offset,
                    limit: limit,
                    isNext: checkCount > offset
                }
            }

            return res.status(200).json({ message: "product founded succesfully !", data: check, status: true })
        }
        check = await prisma.product.findMany(
            {
                skip: Number(offset),
                take: Number(limit)
            }
        )

        checkCount = await prisma.product.count()
        if (!check || !checkCount)
            return res.status(500).json({ message: "Some Error Happen" })

        await redis.set(pattern, JSON.stringify(check), "EX", 60 * 60 * 1)
        await redis.set('count:product', checkCount, "EX", 60 * 60 * 1)
        check = {
            product: [...check],
            pagination: {
                total: checkCount,
                offset,
                limit,
                isNext: (checkCount > offset)
            }
        }
        return res.status.json({ message: "Product fetch Successfully !", data: check, status: true })

    }
    catch (err) {
        console.log(err);
        next()
    }
}


exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!id)
            return res.status(429).json({ message: "id field is required !", status: false })
        let check = await prisma.product.findUnique({
            where: { id: Number(id) }
        })

        if (!check)
            return res.status(404).json({ message: `id provided is not found `, status: false })

        check = await prisma.product.update({
            where: {
                id: Number(id)
            },
            update: {
                ...req.body
            }
        })
        if (!check)
            return res.status(500).json({ mesage: "field provided are not updated !!", status: false })
        else {
            await redis.del(`product:${id}`)
            return res.status(200).json({ message: `the product with id is updated succesfully !`, data: check, status: true })
        }
    }
    catch (err) {
        console.log(err)
        next()
    }
}


function checkName(data) {
    return data.every(item => item.name.length > 0)
}

exports.productImage = async(req,res,next)=>
{
    try{

    }
    catch(err)
    {
        console.log(err)
        next()
    }
}