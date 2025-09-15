const { prisma } = require('../utils/PrismaClient')
const { redis, clearCache } = require('../utils/redisClient')

exports.createCategory = async (req, res, next) => {
    try {

        const { name } = req.body
        if (!name)
            return res.status(429).json({ message: "Name field is required !", status: false })

        let checkCategory = await prisma.category.findUnique({ where: { name: name } })

        if (checkCategory)
            return res.status(409).json({ message: `Category with name ${name} already exists.`, status: false })
        checkCategory = await prisma.category.create({ data: { name: name } })
        if (!checkCategory)
            throw new Error("Category is not added try again in sometime")
        else {

            clearCache('category:offset:*')
            if (await redis.get("count:category")) {
                await redis.incr("count:category")
            } else {
                await redis.set("count:category", JSON.stringify(await prisma.category.count()), "EX", 60 * 60 * 1)
            }
            return res.status(201).json({ message: `Category created succesfully !`, data: checkCategory, status: true })
        }
    } catch (err) {
        console.log(err)
        next()
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "id field is required", status: false });
        }

        // 1. Check in Redis cache
        let cachedCategory = await redis.get(`category:${id}`);

        if (cachedCategory) {
            console.log("Cache hit");
            return res.status(200).json({
                message: "Category found (from cache)",
                data: JSON.parse(cachedCategory),
                status: true,
            });
        }

        // 2. If not in cache, fetch from DB
        const category = await prisma.category.findUnique({
            where: { id: Number(id) }, // make sure id is number if your schema uses Int
        });

        if (!category) {
            return res.status(404).json({
                message: `The category with id: ${id} not found`,
                status: false,
            });
        }

        // 3. Save result in Redis (cache it)
        await redis.set(`category:${id}`, JSON.stringify(category), "EX", 60 * 60 * 1); // expire after 5 mins

        return res.status(200).json({
            message: "Category found successfully",
            data: category,
            status: true,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.getCategory = async (req, res, next) => {
    try {
        const { offset = 0, count = 10 } = req.query;

        // validate
        if (isNaN(offset) || isNaN(count)) {
            return res.status(400).json({
                message: "Offset and count must be numbers!",
                status: false
            });
        }

        // cache key should include both offset + count
        const cacheKey = `category:offset:${offset}:count:${count}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                message: "Categories fetched successfully (from cache)",
                data: JSON.parse(cachedData),
                status: true,
            });
        }

        // fetch from db
        const categories = await prisma.category.findMany({
            skip: Number(offset),
            take: Number(count),
        });

        const total = await prisma.category.count();

        // store in cache only if categories exist
        if (categories.length > 0) {
            await redis.set(
                cacheKey,
                JSON.stringify({
                    message: "Data fetched succesfully !", data: categories, pagination: {
                        total,
                        offset: Number(offset),
                        count: Number(count),
                        hasMore: Number(offset) + Number(count) < total,
                    },
                    status: true,
                }),
                "EX",
                60 * 60 * 1 // cache 1 hour
            );
        }

        return res.status(200).json({
            message: "Categories fetched successfully",
            data: categories,
            pagination: {
                total,
                offset: Number(offset),
                count: Number(count),
                hasMore: (total > offset),
            },
            status: true,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {

        const { id } = req.params
        const { name } = req.body


        if (!id) {
            return res.status(400).json({ message: "id field is required", status: false });
        }
        if (!name) {
            return res.status(400).json({ message: "name field is required", status: false });
        }


        let check = await prisma.category.findUnique({ where: { id: Number(id) } })

        if (!check)
            return res.status(404).json({ message: `the category with id : ${id} not found`, status: false })
        check = await prisma.category.findUnique({ where: { name: name } })
        if (check)
            return res.status(404).json({ message: `the category with name : ${name} already exist`, status: false })

        check = await prisma.category.update({ where: { id: Number(id) }, data: { name: name } })
        console.log(check)
        if (!check)
            return res.status(500).json({ message: `the category with id : ${id} not deleted try in sometime`, status: false })
        await redis.set(`category:${id}`, JSON.stringify(check), "EX", 60 * 60 * 1)
        clearCache('category:offset:*')
        res.status(201).json({ message: "data updated succesfully !", status: true })
    } catch (err) {
        console.log(err)
        next()
    }
}

exports.deleteCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "id field is required", status: false });
        }

        // check if category exists
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!category) {
            return res.status(404).json({ message: "Category not found", status: false });
        }

        // delete products referencing this category
        await prisma.product.deleteMany({
            where: { categoryId: Number(id) },
        });

        // delete category
        await prisma.category.delete({ where: { id: Number(id) } });

        // delete Redis cache for this category
        await redis.del(`category:${id}`);

        // optionally, delete any cached paginated lists that include this category
        const stream = redis.scanStream({ match: "category:offset:*", count: 100 });
        stream.on("data", (keys) => {
            if (keys.length) {
                redis.del(keys); // deletes batch of keys
            }
        });
        if (await redis.get("count:category")) {
            await redis.incr("count:category")
        }

        return res.status(200).json({ message: "Category and related products deleted successfully", status: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.createMultipleCategory = async (req, res, next) => {
    try {

        const { data } = req.body
        if (!(data.length > 0) || !(checkName(data)))
            return res.status(429).json({ message: "Category Name not present !", status: false })

        let addCategory = await prisma.category.createMany(
            {
                data,
                skipDuplicates: true
            })
        if (!addCategory)
            return res.status(200).json({ message: "Some error on server side", satus: false })

        clearCache('category:offset:*')
        if (await redis.get("count:category")) {
            await redis.incr("count:category")
        } else {
            await redis.set("count:category", JSON.stringify(await prisma.category.count()), "EX", 60 * 60 * 1)
        }
        return res.status(201).json({ message: "Category Added succesfully !", data, status: true })

    }
    catch (err) {
        console.log(err)
        next()
    }
}

function checkName(data) {
    return data.every((i) => i.name.length > 1)
}