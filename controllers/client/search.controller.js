const Products = require("../../model/products.model");
const unicode = require("unidecode");

module.exports.index = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (keyword) {
            console.log(keyword);
            let keywordSlug = keyword.trim();
            const keywordUnidecode = unicode(keyword.trim().replace(/\s/g, "-").replace(/-+/g, "-")); // => "hoabi"

            //thay the cac dau " " bang "-"
            keywordSlug = keywordSlug.replace(/\s/g, "-");

            keywordSlug = keywordSlug.replace(/-+/g, "-");

            keywordSlug = unicode(keywordSlug);

            const regexKeyword = new RegExp(keyword, "i");
            const regexKeywordSlug = new RegExp(keywordSlug, "i");
            const products = await Products.find({
                $or: [{
                    title: regexKeyword
                }, {
                    slug: regexKeywordSlug
                },
                    // { title_unidecode: regexKeywordUnidecode }, // <-- THÊM CÁI NÀY
                    // { searchable_text: regexKeywordUnidecode }
                ],
                deleted: false,
                status: "active",

            });
            let ListProduct = [];

            for (const item of products) {
                item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
                let Infor = {
                    title: item.title,
                    thumbnail: item.thumbnail,
                    slug: item.slug,
                    id: item.id,
                    price: item.priceNew,
                    description: item.description,
                }
                item.infor = Infor;
                ListProduct.push(item.infor);
            }

            res.render("client/pages/search/index", {
                products: products,
                pageTitle: "Kết quả tìm kiếm",
                keyword: keyword,
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");

    }
}


module.exports.indexSuggest = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (keyword) {
            console.log(`Keyword tìm kiếm: ${keyword}`);

            // 1. Tiền xử lý từ khóa tìm kiếm
            const normalizedKeyword = keyword.toLowerCase().trim();

            // Tạo regex cho từ khóa gốc
            const regexKeyword = new RegExp(normalizedKeyword, "i");

            // Tạo regex cho phiên bản slug (không dấu, gạch ngang)
            const keywordSlug = unicode(normalizedKeyword).replace(/\s/g, "-").replace(/-+/g, "-");
            const regexKeywordSlug = new RegExp(keywordSlug, "i");

            // Tạo regex cho phiên bản tối giản (không dấu, không khoảng trắng, không gạch ngang)
            const simpleKeyword = unicode(normalizedKeyword).replace(/[\s-]/g, "");
            const regexSimpleKeyword = new RegExp(simpleKeyword, "i");

            // 2. Tối ưu truy vấn tìm kiếm
            // Quan trọng: Tìm kiếm trong trường `searchableText` đã được xử lý, thay vì `title`
            const products = await Products.find({
                $or: [
                    { title: regexKeyword },
                    { slug: regexKeywordSlug },
                    { searchable_text: regexSimpleKeyword }
                ],
                deleted: false,
                status: "active",
            }).select("title thumbnail slug price discountPercentage description"); // Chỉ lấy các trường cần thiết
            // 3. Sử dụng .map() để xử lý dữ liệu gọn gàng hơn
            const ListProduct = products.map(item => {
                const priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
                return {
                    title: item.title,
                    thumbnail: item.thumbnail,
                    slug: item.slug,
                    id: item.id,
                    price: priceNew,
                    description: item.description,
                };
            });

            res.json({
                code: 200,
                pro: ListProduct
            });

        } else {
            // Trường hợp không có từ khóa, trả về danh sách rỗng
            res.json({
                code: 200,
                pro: []
            });
        }

    } catch (error) {
        console.error("Lỗi trong hàm indexSuggest:", error);
        res.status(500).send("Internal Server Error");
    }
};

