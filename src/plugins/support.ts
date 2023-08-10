import fp from 'fastify-plugin'

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('roundedDiscount', function roundedDiscount(price: number, discountPercentage: number) : number{
    function roundPrice(number: number): number {
      const rounded = Math.round(number * 100) / 100;
      return +rounded.toFixed(2);
    }
    function getDiscount(price: number, discountPercentage: number): number{
      return price * ((100 - discountPercentage)/100)
    }
    return roundPrice(getDiscount(price, discountPercentage))
  })

  fastify.decorate('getBase64FromUrl', async function getBase64FromUrl(url: string) : Promise<string>{
    const imageUrlData = await fetch(url)
    const buffer = await imageUrlData.arrayBuffer();
    const stringifiedBuffer = Buffer.from(buffer).toString('base64');
    const contentType = imageUrlData.headers.get('content-type');
    return `data:${contentType};base64,${stringifiedBuffer}`;    
  })

  
})



// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    roundedDiscount(price: number, discountPercentage: number): Function;
    getBase64FromUrl(url: string) :Promise<string>;
  }
}
