import { API } from "./services";
import { sortByKey } from "../global/functions";
import { URL } from "../services/services";
import axios from 'axios';


const ITEMS_PER_PAGE = 1000;

const FormatProduct = (product) => {

    return {
        id: product.codigo, 
        image: {uri: `${URL.HOST}/economia/site/img/${product.codigo}.png`}, 
        bigImage: {uri: `${URL.HOST}/economia/site/img/1x/${product.codigo}.jpg`}, 
        antes: product.Antes,
        price: product.Ahora, 
        discount: product.Porcentaje,
        idoferta: product.idOferta,
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

export const getProducts = async (codigos, location, user, param) => {
    
    let products = [],
        sendData = {marca: "ECO", canal: "APP", ciudad: location, convenio: user.convenio || "", pagina: 1, items: ITEMS_PER_PAGE}

    if(codigos == "ofertas") {
        const {data} = await axios.post(`${URL.HOST}/api/ofertas/`, sendData);
        if(data.success === true) {
            data.data.forEach(item => products.push(FormatProduct(item)));
        }
    } else if(codigos == "cats") {
        console.log("empiezo")
        const {data} = await axios.post(`${URL.HOST}/api/referencias/itemscatsubsingle`, {...sendData, catsubcat: param.sub})
        console.log("termino")
        if(data.success === true) {
            data.data.forEach(item => products.push(FormatProduct(item)));
        }
    } else if(codigos == "search") {
        const {data} = await axios.post(`${URL.HOST}/search`, {search: param.search, location});

        let response = await axios.post(`${URL.HOST}/api/referencias/itemssingle`, {...sendData, codigos: data.products.map(item => item.id)});
        if(response.data.success === true) {
            response.data.data.forEach(item => products.push(FormatProduct(item)));
        }
    } else {
        const {data} = await axios.post(`${URL.HOST}/api/referencias/itemssingle`, {...sendData, codigos});
        if(data.success === true) {
            data.data.forEach(item => products.push(FormatProduct(item)));
        }
    }

    products = products.filter(item => item.stock > 0)
    return products;

    //     const res2 = await API.POST.getProductosPorCodigo(res.message.products.map(item => item.id), location);
    //     let items = sortByKey([...res2.message.data], "Porcentaje", "desc")
    //     for (let i = 0; i < items.length; i++) {
    //         const element = items[i]
    //         if(!element.codigo) continue
    //         if(element.codigo == "209159") console.log(element)
    //         products.push(FormatProduct(element));
    //     }
    //     res.message.products = []
    //     return {...res.message, products}

    // return {products}
}