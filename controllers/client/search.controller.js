const Products = require("../../model/products.model");
const unicode = require("unidecode");

module.exports.index = async (req, res) => {
    try {
          const keyword = req.query.keyword;

        if (keyword) {
            console.log(keyword);
            let keywordSlug = keyword.trim();
            const keywordUnidecode = unicode(keyword.trim().replace(/\s/g, "-").replace(/-+/g, "-")); // => "hoabi"
            // const regexKeywordUnidecode = new RegExp(keywordUnidecode, "i"); // "hoabi"

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
                    console.log(keyword);
                    let keywordSlug = keyword.trim();
                    const keywordUnidecode = unicode(keyword.trim().replace(/\s/g, "-").replace(/-+/g, "-")); // => "hoabi"
                    // const regexKeywordUnidecode = new RegExp(keywordUnidecode, "i"); // "hoabi"

                    //thay the cac dau " " bang "-"
                    keywordSlug = keywordSlug.replace(/\s/g, "-");

                    keywordSlug = keywordSlug.replace(/-+/g, "-");

                    keywordSlug = unicode(keywordSlug);

                    const regexKeyword = new RegExp(keyword, "i");
                    const regexKeywordSlug = new RegExp(keywordSlug, "i")

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
                    if (req.params.type == "suggest") {


                        res.json({
                            code: 200,
                            pro: ListProduct

                        });

                    }
                }
      
                } catch (error) {
                    console.log(error);
                    res.status(500).send("Internal Server Error");

                }
            
        }
    