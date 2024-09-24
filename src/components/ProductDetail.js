import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, Dimensions, ActivityIndicator } from "react-native";

import { f, CapitalizeWord, IsExcludedCategory } from '../global/functions';
import { HELPER_API, URL, } from "../services/services";


import Carousel from "./Carousel";
import Cantidad from "./Cantidad";
import Button from "./Button";
import { getProducts } from "../services/products";


import { UtilitiesContext } from '../context/UtilitiesContext'

const {height} = Dimensions.get('window')
const volver = require('../../assets/icons/times.png')
const noimage = require('../../assets/icons/product/noimage.png')
const oferta = require('../../assets/icons/oferta2.png')


export const ProductDetail = ({
    productID,
    onClose = () => {},
    visible = false,
    navigation
}) => {


    const [loading, setLoading] = useState(true)
    const [loadingGallery, setLoadingGallery] = useState(false)
    const [currentImage, setCurrentImage] = useState(null)

    const [product, setProduct] = useState({})
    const [gallery, setGallery] = useState([])

    const { location, user, cart, setCartItem } = useContext(UtilitiesContext)


    useEffect(() => {

        (async function() {
            setProduct({})
            if(!productID) return
            await retrieveProduct();
        })()
        
    }, [productID])

    const addCart = (item) => {
        setCartItem(item.id, 1, 0, item)
        
    }

    const onChange = (value, item) => {
        setCartItem(item.id, undefined, value, cart.items[item.id])
    }
    
    const retrieveProduct = async () =>
    {
        let p = false, _gallery

        setLoading(true);
        const products = await getProducts("[code]" +  productID, location.id, user)
        setLoading(false);

        if(products.products.length > 0) {
            p = products.products[0]
        }
        
        if(p) {
            setLoadingGallery(true)
            _gallery = [{source: p.bigImage}]
            const imageRes = await HELPER_API.HEAD.CheckIfImageExists(p.image.uri)
            if(imageRes.error)
            {
                p.image = noimage
            }

            const bigImageRes = await HELPER_API.HEAD.CheckIfImageExists(p.bigImage.uri)
            if(bigImageRes.error)
            {
                _gallery[0].source = p.image
            }

            const gallery2 = await fillImageGallery(p.id, 1)
            for (let index = 0; index < gallery2.length; index++) {
                _gallery.push({source: {uri: gallery2[index]}})
            }
            setLoadingGallery(false)
                
        } else {   
            Alert.alert('Atención', 'No se pudo obtener la información de este producto.',
            [
                {text: 'Reintentar', onPress: async() => await retrieveProduct()},
                {text: 'Volver', onPress: () => navigation.goBack()}
            ], {cancelable: false})
        }

        setProduct(p)
        setGallery(_gallery)

    }

    const fillImageGallery = async (id, index, gallery = []) =>
    {
        const url = `${URL.HOST}/economia/site/img/galeria/${id}-${index}.jpg`
        
        const res = await HELPER_API.HEAD.CheckIfImageExists(url)
        
        let _array = [...gallery]
        
        if(!res.error)
        {
            _array.push(url)
            return await fillImageGallery(id, (index + 1), _array)
        }
        
        return _array
    }

    const onTapImage = (data) => {
        setCurrentImage(data.source.uri)
    }

    let hasDiscount = false
    let itemCart = false
    if(cart.items) itemCart = cart.items[productID]
        
    if(product && (product.discount > 0 && !IsExcludedCategory(product.subgrupo36))) hasDiscount = true


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={{flex:1, backgroundColor: "rgba(0,0,0,0.6)"}}>
                
                <View style={{backgroundColor:"white", height: "95%", position:"absolute", left: 0, bottom: 0, width:"100%", padding:10, borderTopLeftRadius:15, borderTopRightRadius:15}} >
                    <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                        <TouchableOpacity onPress={() => onClose()} style={{width:35, height:35, borderRadius:18, backgroundColor:"#222", alignItems:"center", justifyContent:"center"}}>
                            <Image source={volver} tintColor="white" resizeMode='contain' style={{width:16, height:16, tintColor: 'white'}} />
                        </TouchableOpacity>
                    </View>

                    {currentImage && 
                    <View style={{flex:1, position:"relative"}}>
                        <TouchableOpacity onPress={() => setCurrentImage(null)} style={{position:"absolute", zIndex:100, width:110, height:40, backgroundColor:"rgba(0,0,0,0.7)", borderRadius:25, top:0, left:0}}>
                            <Text style={{textAlign: "center", color:"white", lineHeight:40}}>Cerrar Imagen</Text>
                        </TouchableOpacity>
                        <Image source={{uri: currentImage}}  style={{width:"100%", height:"100%"}} resizeMode="contain" />
                    </View>}
                    {!currentImage && 
                    <ScrollView>
                        {loading && 
                        <View>
                            <Text style={{textAlign: "center"}}>Leyendo información del producto...</Text>
                        </View>
                        }
                        {!loading && Object.keys(product).length > 0 &&
                        <View style={styles.scrollContainer}>
                            
                            {hasDiscount && 
                            <View style={styles.descuentoCont}>
                                <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                                <Text style={styles.descuento}>{`${product.discount}%`}</Text>
                            </View>
                            }
                            
                            {loadingGallery && <View style={{height:220, flexDirection:"row", alignItems:"center"}} ><ActivityIndicator color={"#1B42CB"} /></View>}
                            {!loadingGallery &&
                            <Carousel  
                                autoscroll={true}
                                imageStyle = {{height: 220}}
                                images2={loading ? [] : gallery}
                                imageResizeMode={'contain'}
                                onTapImage={onTapImage}
                            />
                            }

                            <Text style={styles.proveedor}>{product.proveedor}</Text>
                            <View style={styles.productNameContainer}>
                                <Text style={styles.nombre}>{CapitalizeWord(product.name)}</Text>
                            </View>
                            <Text style={[styles.proveedor, {color:"#666"}]}>CÓDIGO: {product.id}</Text>
                            
                            <View style={[styles.rowCenter, {marginVertical:15}]}>
                                {hasDiscount && <Text style={styles.precioAntes}>{f(product.antes)}</Text>}
                                <Text style={[styles.precio, {color: hasDiscount ? "#FF2F6C" : "#333"}]}>{f(product.price)}</Text>
                            </View>

                            {product.unit && <Text style={styles.unidad}>{product.unit}</Text>}

                            <View style={{height: 20}} />
                            <View style={styles.addToCartContainer}>
                                {itemCart && itemCart._quanty > 0 && <Cantidad value={itemCart._quanty} item={product} onChange={onChange} />}
                                {!itemCart && <Button title="AGREGAR AL CARRITO" onPress={() => addCart(product)} />}
                            </View>
                            
                            {product.additionalDescription &&
                            <View style={{width:"100%", paddingHorizontal:20}}>
                                <View style={styles.productDescriptionTitleContainer}>
                                    <Text style={styles.productDescriptionTitleText}>INFORMACIÓN ADICIONAL</Text>
                                </View>

                                <View style={styles.productDescriptionContainer}>
                                    <Text style={styles.productDescriptionText}>{product.additionalDescription}</Text>
                                </View>
                            </View>
                            }
                            
                        </View>
                    }

                    </ScrollView>
                    }

                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    rowCenter: {flexDirection:"row", alignItems:"center", justifyContent: "center"},
    container: {flex: 1},
    scrollContainer: {alignItems: 'center', position: "relative", paddingBottom:40},
    proveedor: {
        paddingHorizontal:10, 
        fontSize:14,
        marginVertical:10, 
        color: "#aaa"
    },

    productImageContainer: { width: height * .35, height: height * .35, alignItems: 'center', },
    productImage: {height: '100%', width: '100%',},

    productNameContainer: {width: '90%', marginVertical: 10},
    nombre: {
        fontSize: 24, 
        textAlign: 'center', 
        color: "#333", 
        fontFamily: "TommyM" 
    },
    precio: { 
        fontSize: 26, 
        textAlign: 'center', 
        color: "#1B42CB", 
        fontFamily: "Tommy",
        marginHorizontal:10
    },

    precioAntes: {
        fontSize: 16, 
        textDecorationLine: 'line-through', 
        color: "#999", 
        fontFamily: "Tommy"
    },
    productDetailsPriceDiscountPercentContainer: {marginHorizontal: 3, width: 44, padding: 2, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderColor: "#FF2F6C", borderWidth: 1},


    unidad: {
        fontSize: 14, 
        color: "#555", 
        fontFamily: "TommyR", 
        marginTop: 5
    },

    productDescriptionTitleContainer: {width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: "#f2f2f2"},
    productDescriptionTitleText: {fontSize: 14, color: "#444", fontFamily: "RobotoB", marginTop:30, textAlign:"center"},

    productDescriptionContainer: {width: '80%', padding: 15},
    productDescriptionText: {fontSize: 18, color: "#657272", fontFamily: "Roboto"},

    addButton: {
        paddingHorizontal: 35, 
        borderRadius: 30, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: "#0a61d0", 
        marginBottom:10,
        elevation: 6,
        shadowColor: "rgba(0,0,0,0.3)", 
        shadowOffset: {width: 1, heigth: 2}, 
        shadowOpacity: 2, 
        shadowRadius: 8
    },
    addButtonText: {
        fontSize: 19, 
        paddingHorizontal: 45, 
        paddingVertical:15, 
        color: "#fff", 
        textAlignVertical: 'center', 
        fontFamily: "RobotoB"
    },

    descuentoCont: { position: 'absolute', top: 0, left: 30, width: 50, height: 50, justifyContent: 'center', zIndex: 100},
    discountImg: {width:55, height: 55, position:"absolute", zIndex:-1, top:3, right:3},
    descuento: {
        textAlign: "center", 
        fontSize: 19, 
        color:"white", 
        fontFamily: "RobotoB", 
        width:40, height: 26, 
        position:"absolute", 
        textAlign:"center", 
        zIndex:1, 
        top:17, 
        left:0, 
        lineHeight:26
    },
})