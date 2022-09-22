import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, Alert, Dimensions, ActivityIndicator } from "react-native";
import _ from 'lodash'

import { f, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../utils/helper";
import { API, HELPER_API, URL, } from "../services/services";

import { FormatProduct } from "../utils/formatter";

import Carousel from "./Carousel";
import Cantidad from "../components/Cantidad";
import { UtilitiesContext } from '../context/UtilitiesContext'

const {width, height} = Dimensions.get('window')
const volver = require('../../assets/icons/times.png')
const noimage = require('../../assets/icons/product/noimage.png')
const oferta = require('../../assets/icons/oferta2.png')


export const ProductDetail = ({
    productID,
    onClose = () => {},
    visible = false,
    navigation,
}) => {


    const [loading, setLoading] = useState(true)
    const [zoomMode, setZoomMode] = useState(false)

    const [product, setProduct] = useState({})
    const [gallery, setGallery] = useState([])

    const { location, cart, setCartItem } = useContext(UtilitiesContext)

    useEffect(() => {

        (async function() {
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
        setLoading(true);

        let res;

        let res2 = await API.POST.search("[code]" +  productID, location.id)
        if(!res2.error) {
            res = await API.POST.PerformRetrieveProductsFromCodeList([res2.message.products[0].id], location.id)
        }

        let _state = {
            loading: false,
            product: {},
            gallery: [],
        }
        
        if(!res.error)
        {
            
            if(res.message.data.length > 1)
            {
                _state.product = FormatProduct(res.message.data[0])
                _state.gallery = [{source: _state.product.bigImage}]
                const imageRes = await HELPER_API.HEAD.CheckIfImageExists(_state.product.image.uri)
                if(imageRes.error)
                {
                    _state.product.image = noimage
                }

                const bigImageRes = await HELPER_API.HEAD.CheckIfImageExists(_state.product.bigImage.uri)
                if(bigImageRes.error)
                {
                    _state.gallery[0].source = _state.product.image
                }

                const gallery = await fillImageGallery(_state.product.id, 1)
                for (let index = 0; index < gallery.length; index++) {
                    _state.gallery.push({source: {uri: gallery[index]}})
                }
                
            }
        }
        else
        {   
            Alert.alert('Atención', 'No se pudo obtener la información de este producto.',
            [
                {text: 'Reintentar', onPress: async() => await retrieveProduct(location, product, searchBy)},
                {text: 'Volver', onPress: () => navigation.goBack()}
            ], {cancelable: false})
        }

        setLoading(_state.loading)
        setProduct(_state.product)
        setGallery(_state.gallery)

    }

    const fillImageGallery = async (productId, index, gallery = []) =>
    {
        const url = `${URL.HOST}/economia/site/img/galeria/${productId}-${index}.jpg`
        
        const res = await HELPER_API.HEAD.CheckIfImageExists(url)
        
        let _array = [...gallery]
        
        if(!res.error)
        {
            _array.push(url)
            return await fillImageGallery(productId, (index + 1), _array)
        }
        
        return _array
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
                            <Image source={volver} tintColor="white" resizeMode='contain' style={{width:16, height:16}} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {loading && <ActivityIndicator color={"#1B42CB"} />}
                        {!loading && product &&
                        <View style={styles.scrollContainer}>
                            
                            {hasDiscount && 
                            <View style={styles.vidaSanaIndicatorContainer}>
                                <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                                <Text style={styles.productDetailsPricePercentDiscount}>{`${product.discount}%`}</Text>
                            </View>
                            }
                            
                            {!loading &&
                            <Carousel  
                                imageStyle = {{height: 240}}
                                images2={gallery}
                                imageResizeMode={'contain'} 
                            />}
                        
                            <Text style={styles.proveedor}>{product.proveedor}</Text>
                            <View style={styles.productNameContainer}>
                                <Text style={styles.productNameText}>{CapitalizeWord(product.name)}</Text>
                            </View>
                            

                            {hasDiscount &&
                            <View style={styles.discountContainer}>
                                <Text style={styles.productDetailsPriceText}>{f(product.antes)}</Text>
                            </View>
                            }

                            <Text style={[styles.productPriceText, {color: hasDiscount ? "#FF2F6C" : "#333"}]}>{f(product.price)}</Text>

                            {product.unit != '' && <Text style={styles.pricePerUnitText}>{CapitalizeWords(product.unit)}</Text>}

                            <View style={styles.addToCartContainer}>
                                {itemCart && itemCart._quanty > 0 && <Cantidad value={itemCart._quanty} item={product} onChange={onChange} />}
                                {!itemCart && 
                                <TouchableOpacity style={styles.footerAddToCartButton} onPress={() => addCart(product)}>
                                    <Text style={styles.footerAddToCartButtonText}>AGREGAR</Text>
                                </TouchableOpacity>
                                }
                            </View>
             
                            <Text style={styles.disponibles}>{product.stock} Disponibles</Text>
                    
                            {product.additionalDescription != '' &&
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

                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={zoomMode}
                        onRequestClose={() => {}}
                    >
                    
                    </Modal>
                
                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    
    container: {flex: 1},
    scrollContainer: {alignItems: 'center', position: "relative", paddingBottom:40},
    proveedor: {paddingHorizontal:30, fontSize:12, marginTop:20, color: "#999"},
    disponibles: {
        backgroundColor:"#48b0b0", 
        color:"white", 
        paddingVertical:6, 
        paddingHorizontal:20, 
        borderRadius:20, 
        textAlign:"center", 
        marginTop:20,
    },
    productImageContainer: { width: height * .35, height: height * .35, alignItems: 'center', },
    productImage: {height: '100%', width: '100%',},

    productNameContainer: {width: '90%', marginVertical: 10},
    productNameText: { fontSize: 22, textAlign: 'center', color: "#333", fontFamily: "Roboto" },
    productPriceText: { fontSize: 23, textAlign: 'center', color: "#1B42CB", fontFamily: "RobotoB", margin:10 },

    discountContainer: {width: '100%', flexDirection: 'row', justifyContent: 'center', padding: 5},
    productDetailsPriceText: {fontSize: 16, textDecorationLine: 'line-through', color: "#9EA6A6", fontFamily: "Roboto"},
    productDetailsPriceDiscountPercentContainer: {marginHorizontal: 3, width: 44, padding: 2, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderColor: "#FF2F6C", borderWidth: 1},
    productDetailsPricePercentDiscount: {fontSize: 12, color: "#FF2F6C", fontFamily: "RobotoB"},

    pricePerUnitText: {
        fontSize: 14, 
        color: "#555", 
        marginBottom: 20, 
        fontFamily: "Roboto", 
        marginTop: 5
    },

    productDescriptionTitleContainer: {width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: "#f2f2f2"},
    productDescriptionTitleText: {fontSize: 14, color: "#444", fontFamily: "RobotoB", marginTop:30, textAlign:"center"},

    productDescriptionContainer: {width: '80%', padding: 15},
    productDescriptionText: {fontSize: 18, color: "#657272", fontFamily: "Roboto"},

    footerAddToCartButton: {
        paddingHorizontal: 35, 
        borderRadius: 8, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: "#0a61d0", 
        marginTop:5,
        marginBottom:10,
        elevation: 6,
        shadowColor: "#000", 
        shadowOffset: {width: 0, heigth: 0}, 
        shadowOpacity: 7, 
        shadowRadius: 20
    },
    footerAddToCartButtonText: {
        fontSize: 16, 
        paddingHorizontal: 45, 
        paddingVertical:15, 
        color: "#fff", 
        textAlignVertical: 'center', 
        fontFamily: "RobotoB"
    },

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 30, width: 50, width: 50, justifyContent: 'center', zIndex: 100},
    discountImg: {width:50, height: 50, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 18, color:"white", fontFamily: "RobotoB", width:47, height: 38, position:"absolute", textAlign:"center", zIndex:1, top:13, left:0},
})