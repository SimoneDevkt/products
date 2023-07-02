import S from 'fluent-json-schema'

export const envSchema = S.object()  
    .prop('PRODUCTS_API_URL', S.string().required())
.valueOf()

export const productsRaw = {
    params: S.object()
        .prop('id', S.number().required())
        .additionalProperties(false),
    response: {
        200: S.object()
            .prop('status', S.string().required())
            .prop('data', S.object()
                .prop('id', S.number().required())
                .prop('title', S.string().required())
                .prop('description', S.string().required())
                .prop('price', S.number().required())
                .prop('discountPercentage', S.number().required())
                .prop('rating', S.number().required())
                .prop('stock', S.number().required())
                .prop('brand', S.string().required())
                .prop('category', S.string().required())
                .prop('thumbnail', S.string().required())
                .prop('images', S.array().items(S.string()).required())
                .additionalProperties(false)
            ).additionalProperties(false)
    }
}


export const productsProc = {
    params: S.object()
        .prop('id', S.number().required())
        .additionalProperties(false),
    response: {
        200: S.object()
            .prop('status', S.string().required())
            .prop('data', S.object()
                .prop('id', S.number().required())
                .prop('price', S.number().required())
                .prop('priceSell', S.number().required())
                .prop('totalStockValue', S.number().required())
                .prop('totalStockValueSell', S.number().required())
                .additionalProperties(false)
            ).additionalProperties(false)
    }
}

export const productsDownload = {
    params: S.object()
        .prop('id', S.number().required())
        .additionalProperties(false),
    response: {
        200: S.object()
          .prop('status', S.string().required())
          .prop('data', S.object()
            .prop('images', S.array().items(S.string()).required())
            .additionalProperties(false)          
          ).additionalProperties(false)
    }
}