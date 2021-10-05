import { URL } from "../services/service";
import { ParseStrDate, FormatDate } from "./helper";
import { BAG_TAX_ID, DELIVERY_TAX_ID } from "./constants";

export const FormatBrandItem = (brand) =>
{
    return {
        ...brand,
        photo: {uri: `${URL.S3}${brand.photo}`},
    }
}


export const FormatBrandProduct = (product) => 
{
    return {
        ...product,
        productIdInDashboard: product.id,
        id: product.code_product,
        name: product.name_product, 
        image: {uri: `${URL.HOST}/economia/site/img/${product.code_product}.png`}, 
        bigImage: {uri: `${URL.HOST}/economia/site/img/1x/${product.code_product}.jpg`},
        price: product.before, 
        discount: product.percent, 
        minTotalAmount: product.value_minimun,
        unit: product.valor_contenido ? product.valor_contenido : '',
        pricePerUnit: product.pricePerUnit ? product.pricePerUnit : 0,
        unitId: 1,
        additionalDescription: product.descripcion_adicional ? product.descripcion_adicional : '',
    }
}


export const FormatBrandBanner = (banner) => 
{
    return {
        ...banner,
        source: {uri: `${URL.S3}${banner.photo}`},
    }
}

export const FormatLocationItem = (location) => 
{
    return {
        id: location.CentroCostos,
        name: location.Descripcion,
        phone: location.telefono,
        homeService: location.valor_domicilio,
    }
}


export const FormatGroupCategoryItem = (group) => 
{
    const categories = []

    for (let i = 0; i < group.Categorias.length; i++) {
        const category = group.Categorias[i];
        categories.push(FormatCategoryItemFromGroup(category))
    }

    return {
        name: group.Grupo, 
        id: group.IdGrupo, 
        // image: {uri: `${URL.HOST}/economia/site/img/categorias/v2/${group.IdGrupo}.png`}, 
        image: {uri: `${URL.S3_GROUPS}${group.IdGrupo}.png`}, 
        categories,
    }
}

export const FormatCategoryItem = (category) => 
{
    return {
        name: category.Descripcion, 
        id: category.Categoria, 
        image: {uri: `${URL.HOST}/economia/site/img/categorias/v2/${category.Categoria}.png`}, 
        color: category.Color, 
        totalProducts: category.Nroproductos, 
        priority: category.Prioridad,
        subCategories: [{id: category.SubCategoria, name: category.Sub_descripcion}],
    }
}

export const FormatCategoryItemFromGroup = (category) => 
{
    const subCategories = []
    for (let i = 0; i < category.Subcategorias.length; i++) {
        const element = category.Subcategorias[i];
        subCategories.push({id: element.IdSubcategoria, name: element.Subcategoria})
    }

    return {
        name: category.Categoria, 
        id: category.IdCategoria, 
        image: {uri: `${URL.HOST}/economia/site/img/categorias/v2/${category.IdCategoria}.png`}, 
        subCategories,
    }
}


export const FormatProduct = (product) =>
{

    return {
        id: product.codigo, 
        image: {uri: `${URL.HOST}/economia/site/img/${product.codigo}.png`}, 
        bigImage: {uri: `${URL.HOST}/economia/site/img/1x/${product.codigo}.jpg`}, 
        antes: product.Antes,
        price: product.Ahora, 
        discount: product.Porcentaje, 
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


/**
 * Formats a product element according to Purchase API format
 * 
 * @param {Object} product 
 */
export const FormatPurchaseProduct = (product) => 
{
    return {
        codigo: product.id,
        descripcion: product.name,
        price: product.price,
        stock: product.stock,
        IdUnidad: product.unitId ? product.unitId : 1,
        VlrMinimo: product.minTotalAmount,
        cantidad: product.qty, 
        Porcentaje: product.discount,
    }
}



export const FormatAddress = (address) => 
{
    return {
        address: address.direccion,
        alias: address.nombre_direccion,
    }
}


export const FormatOrder = (order) => 
{
    return {
        createDate: FormatDate(ParseStrDate(order.fec)),
        type: order.tipo,
        reference: order.numero,
        referenceNumber: order.numerodomicilio,
        total: order.total,
        date:order.fec
    }
}

export const FormatProductOrder = (order) => 
{
    
    return {
        qty: order.cantidad,
        price: order.valor_unitario,
        total: order.total,
        id: order.codigo,
        name: order.descripcion,
        discount: order.descuento,
        address: order.direccion,
        createDate: order.fec,
        reference: order.numero,
        referenceNumber: order.numerodomicilio,
        tax: order.porcentaje_iva,
        phone: order.telefono,
        type: order.tipo,
        image: order.codigo == "999992" ? require('../../assets/icons/payment/delivery.png') : {uri: `${URL.HOST}/economia/site/img/${order.codigo}.png`},
        bigImage: order.codigo == "999992" ? require('../../assets/icons/payment/delivery.png') : {uri: `${URL.HOST}/economia/site/img/1x/${order.codigo}.jpg`},
        unit: order.valor_contenido ? order.valor_contenido : '',
        pricePerUnit: order.precioMedida ? order.precioMedida : 0,
    }
}

export const FormatProductForOrderDetail = (product) =>
{
    const realCant = parseInt(product.cantidad / product.idunidad)
    return {
        qty: realCant,
        location: product.ciudad,
        id: product.codigo,
        name: product.descripcion,
        discount: parseInt(product.descuento),
        image: setProductImage(product.codigo),
        bigImage: setProductImage(product.codigo, true),
        unit: product.valor_contenido ? product.valor_contenido : '',
        pricePerUnit: product.precioMedida ? product.precioMedida : 0,
        address: product.direccion,
        createDate: product.fec,
        unitId: product.idunidad,
        reference: product.numero,
        referenceNumber: product.numerodomicilio,
        tax: product.porcentaje_iva,
        antes:parseInt(product.valor_unitario * product.cantidad),
        oldPrice: parseInt(product.valor_unitario * product.cantidad) * (1 - parseInt(product.descuento) / 100),
        price: parseInt(product.precio_actual * product.cantidad),
        stock: product.stock,
        phone: product.telefono,
        type: product.tipo,
        total: product.total,
    }
}

const setProductImage = (id, bigImage = false) => 
{
    let image = bigImage ? {uri: `${URL.HOST}/economia/site/img/1x/${id}.jpg`} : {uri: `${URL.HOST}/economia/site/img/${id}.png`}
    if(id == BAG_TAX_ID)
    {
        image = require('../../assets/icons/product/noimage.png')
    }
    else if(id == DELIVERY_TAX_ID)
    {
        image = require('../../assets/icons/payment/delivery.png')
    }

    return image
}


export const FormatBonus = (bonus) =>
{
    return {
        id: bonus.Id,
        document: bonus.Cedula,
        status: bonus.Estado,
        typeOfBill: bonus.TipoFactura,
        billNumber: bonus.NumeroFactura,
        bonus: bonus.VlrBono,
        minPurchaseToApplyBonus: bonus.VlrMinimoCompra,
        startDate: bonus.FchRdnDesde,
        endDate: bonus.FchRdnHasta,
        endDate: bonus.FchRdnHasta,
        type: bonus.Condicion,
        percentBonus: bonus.EsPorcentaje,
        description: bonus.Descripcion,
    }
}


export const FormatProductForBonus = (product) =>
{
    return{
        codigo: product.id,
        cantidad: product.qty,
        price: product.price,
    }
}

export const FormatCoupon = (coupon) => 
{
    return {
        document: coupon.Cedula,
        type: coupon.Condicion,
        description: coupon.Descripcion,
        startDate: coupon.Desde,
        status: coupon.Estado,
        modifiedAt: coupon.FechaActualizacion,
        endDate: coupon.Hasta,
        id: coupon.IdCupon,
        name: coupon.NombreCupon,
        strType: coupon.TipoCupon, // <= Type of coupon as string
        value: coupon.ValorCupon, // <= Amount of coupon
        minAmount: coupon.VlrMinimo, // <= Min. amount of the purchase/order to apply this coupon
        isValid: false,
    }
}


export const UnformatCoupon = (coupon) => 
{
    if(coupon.type == undefined || coupon.type == null)
    {
        return { Aplica: false }
    }

    return {
        Cedula: coupon.document,
        Condicion: coupon.type,
        Descripcion:coupon.description,
        Desde: coupon.startDate,
        Estado: coupon.status,
        FechaActualizacion: coupon.modifiedAt,
        Hasta: coupon.endDate,
        IdCupon: coupon.id,
        NombreCupon: coupon.name,
        TipoCupon: coupon.strType,
        ValorCupon: coupon.value,
        VlrMinimo: coupon.minAmount,
        Aplica: coupon.isValid,
    }
}