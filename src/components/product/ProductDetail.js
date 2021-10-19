import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, DeviceEventEmitter, Modal, Alert, Dimensions, ActivityIndicator } from "react-native";
import _ from 'lodash'
import { COLORS, FONTS, ON_MODIFY_CART_EVENT } from "../../utils/constants";
import { ToCurrencyFormat, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../../utils/helper";
import { API, SEARCH_BY, HELPER_API, URL, } from "../../services/service";
import LocationStore from "../../reducers/location.reducer";
import { FormatProduct } from "../../utils/formatter";
import { ZoomImage } from "../../components/images/ZoomImage";
import Carousel from "../../components/Carousel";
import { AddToShopCart} from "../../utils/shopcartHelper";

const {width, height} = Dimensions.get('screen')
const volver = require('../../../assets/icons/times.png')


export const ProductDetail = props => {


    const [loading, setLoading] = useState(true)
    const [zoomMode, setZoomMode] = useState(false)


    const [product, setProduct] = useState({})
    const [gallery, setGallery] = useState([])



    const [selectedImage, setSelectedImage] = useState(0)


    useEffect(() => {

        (async function() {
            if(!props.productID) return
            const res = await retrieveProduct(LocationStore.getState().location);
            console.log(res)
        })()
        
    }, [props.productID])
    
    const retrieveProduct = async (location) =>
    {
        setLoading(true);

        let res;

        let res2 = await API.POST.search("[code]" +  props.productID, location)
        if(!res2.error) {
            res = await API.POST.PerformRetrieveProductsFromCodeList([res2.message.products[0].id], location)
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
                    _state.product.image = require('../../../assets/icons/product/noimage.png')
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
                {text: 'Volver', onPress: () => props.navigation.goBack()}
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


    const zoomProductVisible = (image, visible) =>
    {
        let _state = {
            zoomMode: visible,
            selectedImage: 0,
        }

        if(image)
        {
            const imageIndex = _.findIndex(gallery, (item) => item.source.uri == image.source.uri)
            
            if(imageIndex != 0)
            {
                _state.selectedImage = imageIndex
            }
        }

        setSelectedImage(_state.selectedImage)
        setZoomMode(_state.zoomMode)

    }


    const addCart = () => {
        let quantity = 1
        AddToShopCart(product, quantity).then(res => {
            DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: res.totalProductsInCart + quantity})
        })
    }

    let hasDiscount = false
        
    if(product && (product.discount > 0 && !IsExcludedCategory(product.subgrupo36))) hasDiscount = true

    return (


            <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
            >
                <View style={{flex:1, backgroundColor: "rgba(0,0,0,0.6)"}}>
                    
                    <View style={{backgroundColor:"white", height: height * 0.80, position:"absolute", left: 0, bottom: 0, width, padding:10, borderTopLeftRadius:15, borderTopRightRadius:15}} >
                        <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                            <TouchableOpacity onPress={() => props.onClose()} style={{width:35, height:35, borderRadius:18, backgroundColor:"#222", alignItems:"center", justifyContent:"center"}}>
                                <Image source={volver} tintColor="white" resizeMode='contain' style={{width:16, height:16}} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {loading && <ActivityIndicator color={COLORS._1B42CB} />}
                            {!loading && product &&
                            <View style={styles.scrollContainer}>
                                
                                {hasDiscount && 
                                <View style={styles.vidaSanaIndicatorContainer}>
                                    <Image source={require("../../../assets/icons/oferta2.png")} style={styles.discountImg} resizeMode="contain"/>
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
                                    <Text style={styles.productDetailsPriceText}>{ToCurrencyFormat(product.antes)}</Text>
                                    
                                </View>}

                                <Text style={[styles.productPriceText, {color: hasDiscount ? COLORS._FF2F6C : COLORS._1B42CB}]}>{ToCurrencyFormat(product.price)}</Text>

                                {product.unit != '' && <Text style={styles.pricePerUnitText}>{CapitalizeWords(product.unit)}</Text>}

                                <TouchableOpacity style={styles.footerAddToCartButton} onPress={addCart}>
                                    <Text style={styles.footerAddToCartButtonText}>AGREGAR</Text>
                                </TouchableOpacity>
                                
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
                            <ZoomImage images = {gallery} selected = {selectedImage} onClose={() => zoomProductVisible(0, false)} />
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
    disponibles: {backgroundColor:"#48b0b0", color:"white", paddingVertical:6, paddingHorizontal:20, borderRadius:20, textAlign:"center", marginTop:10},
    productImageContainer: { width: height * .35, height: height * .35, alignItems: 'center', },
    productImage: {height: '100%', width: '100%',},

    productNameContainer: {width: '70%', marginVertical: 10},
    productNameText: { fontSize: 22, textAlign: 'center', color: "#333", fontFamily: FONTS.REGULAR },
    productPriceText: { fontSize: 23, textAlign: 'center', color: COLORS._1B42CB, fontFamily: FONTS.BOLD, margin:10 },

    discountContainer: {width: '100%', flexDirection: 'row', justifyContent: 'center', padding: 5},
    productDetailsPriceText: {fontSize: 16, textDecorationLine: 'line-through', color: COLORS._9EA6A6, fontFamily: FONTS.REGULAR},
    productDetailsPriceDiscountPercentContainer: {marginHorizontal: 3, width: 44, padding: 2, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderColor: COLORS._FF2F6C, borderWidth: 1},
    productDetailsPricePercentDiscount: {fontSize: 12, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD},

    pricePerUnitText: { fontSize: 12, color: COLORS._657272, marginBottom: 20, fontFamily: FONTS.REGULAR, marginTop: 5 },

    productDescriptionTitleContainer: {width: '100%', padding: 10, borderBottomWidth: 1, borderBottomColor: "#f2f2f2"},
    productDescriptionTitleText: {fontSize: 14, color: "#444", fontFamily: FONTS.BOLD, marginTop:30, textAlign:"center"},

    productDescriptionContainer: {width: '80%', padding: 15},
    productDescriptionText: {fontSize: 18, color: COLORS._657272, fontFamily: FONTS.REGULAR},

    footerAddToCartButton: {paddingHorizontal: 35, borderRadius: 6, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._1B42CB, marginTop:5},
    footerAddToCartButtonText: {fontSize: 16, paddingHorizontal: 45, paddingVertical:15, color: "#fff", textAlignVertical: 'center', fontFamily: FONTS.BOLD},

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 30, width: 50, width: 50, justifyContent: 'center', zIndex: 100},
    discountImg: {width:50, height: 50, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 18, color:"white", fontFamily: FONTS.BOLD, width:47, height: 38, position:"absolute", textAlign:"center", zIndex:1, top:13, left:0},
})