import S from 'fluent-json-schema'

export const envSchema = S.object()  
    .prop('PRODUCTS_API_URL', S.string().required())
.valueOf()
