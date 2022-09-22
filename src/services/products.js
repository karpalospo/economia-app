
import { API } from "./services";
import { FormatProduct } from "../utils/formatter";
import { sortByKey} from "../utils/helper";


export const getUpdatedCartItems = async (items, location) => {
    let products = []
    const res = await API.POST.PerformRetrieveProductsFromCodeList(items.map(item => item.id), location)
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
        const res2 = await API.POST.PerformRetrieveProductsFromCodeList(res.message.products.map(item => item.id), location);
        let items = sortByKey([...res2.message.data], "Porcentaje", "desc")
        for (let i = 0; i < items.length; i++) {
            const element = items[i]
            if(!element.codigo) continue
            products.push(FormatProduct(element));
        }
        res.message.products = []
        return {...res.message, products}
    }
    return {products}
}