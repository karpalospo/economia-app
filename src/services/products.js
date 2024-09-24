import { API } from "./services";
import { sortByKey } from "../global/functions";
import { URL } from "../services/services";

const FormatProduct = (product) => {

    return {
        id: product.codigo, 
        image: {uri: `${URL.HOST}/economia/site/img/${product.codigo}.png`}, 
        bigImage: {uri: `${URL.HOST}/economia/site/img/1x/${product.codigo}.jpg`}, 
        antes: product.Antes,
        price: product.Ahora, 
        discount: product.Porcentaje,
        idoferta: product.idoferta,
        name: product.descripcion, 
        unit: product.valor_contenido ? product.valor_contenido : '',
        pricePerUnit: product.precioMedida ? product.precioMedida : 0,
        IdUnidad: (product.IdUnidad ? product.IdUnidad : 1),
        stock: Math.floor(product.stock / (product.IdUnidad ? product.IdUnidad : 1)),
        minTotalAmount: product.VlrMinimo,
        proveedor: product.proveedor,
        category: product.Categoria || "N/A",
        additionalDescription: product.descripcion_adicional ? product.descripcion_adicional : '',
        subgrupo36: product.subgrupo36 ? product.subgrupo36 : '',
    }
}


export const getUpdatedCartItems = async (items, location) => {
    let products = []
    const res = await API.POST.getProductosPorCodigo(items.map(item => item.id), location)
    if(res.error) return products
    res.message.data.forEach(item => {
        if(item.codigo) products.push(FormatProduct(item));
    })
    return products
}

export const getProducts = async (str, location, user, data) => {
    
    let products = [];

    if(str == "subcategoria") {
        str = `[cats]${data.substring(0, 5)}/${data}`
    }
    
    let res = await API.POST.search(str, location, user)
   
    if(!res.error) {
        const res2 = await API.POST.getProductosPorCodigo(res.message.products.map(item => item.id), location);
        console.log(res2)
        let items = sortByKey([...res2.message.data], "Porcentaje", "desc")
        for (let i = 0; i < items.length; i++) {
            const element = items[i]
            if(!element.codigo) continue
            if(element.codigo == "209159") console.log(element)
            products.push(FormatProduct(element));
        }
        res.message.products = []
        return {...res.message, products}
    }
    return {products}
}