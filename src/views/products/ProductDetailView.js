import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, DeviceEventEmitter, Modal, Alert, Dimensions, BackHandler, StatusBar, ActivityIndicator } from "react-native";
import { NavigationEvents } from "react-navigation";
import _ from 'lodash'

import { COLORS, FONTS, ON_MODIFY_CART_EVENT } from "../../utils/constants";
import { ToCurrencyFormat, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../../utils/helper";
import { API, SEARCH_BY, HELPER_API, URL, } from "../../services/service";
import LocationStore from "../../reducers/location.reducer";
import { FormatProduct } from "../../utils/formatter";
import { ZoomImage } from "../../components/images/ZoomImage";
import Carousel from "../../components/Carousel";
import Header from "../../components/header/Header";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";
import { AddToShopCart} from "../../utils/shopcartHelper";

const {height} = Dimensions.get('screen')
export default class ProductDetail extends React.Component
{
    state = {

        loading: true,
        zoomMode: false,

        product: null,
        gallery: [],

        addToCartVisible: false,

        selectedImage: 0,
        emptyProduct: '',
        showDiscountAlert: true,
    }

    retrieveProduct = async (location, product, searchBy = SEARCH_BY.CODE) =>
    {
        this.setState({loading: true});

        let res;
        switch (searchBy) {
            case SEARCH_BY.CODE:
                let res2 = await API.POST.search("[code]" + product, location)
                if(!res2.error) {
                    res = await API.POST.PerformRetrieveProductsFromCodeList([res2.message.products[0].id], location)
                }
                break;
            case SEARCH_BY.BAR_CODE:
                const barCodeRes = await API.GET.RetrieveProductFromBarCode(location, product)
                res = {error: true}
                if(!barCodeRes.error)
                {
                    res = await API.GET.RetrieveProductFromCode(location, barCodeRes.message[0].codigo)
                }
                break;
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

                const gallery = await this.fillImageGallery(_state.product.id, 1)
                for (let index = 0; index < gallery.length; index++) {
                    _state.gallery.push({source: {uri: gallery[index]}})
                }
                
            }
        }
        else
        {   
            Alert.alert('Atención', 'No se pudo obtener la información de este producto.',
            [
                {text: 'Reintentar', onPress: async() => await this.retrieveProduct(location, product, searchBy)},
                {text: 'Volver', onPress: () => this.props.navigation.goBack()}
            ], {cancelable: false})
        }

        this.setState({..._state});

    }

    fillImageGallery = async (productId, index, gallery = []) =>
    {
        const url = `${URL.HOST}/economia/site/img/galeria/${productId}-${index}.jpg`
        
        const res = await HELPER_API.HEAD.CheckIfImageExists(url)
        
        let _array = [...gallery]
        
        if(!res.error)
        {
            _array.push(url)
            return await this.fillImageGallery(productId, (index + 1), _array)
        }
        
        return _array
    }

    onGoBackPressed = () =>
    {
        this.props.navigation.goBack();
    }


    zoomProductVisible = (image, visible) =>
    {
        let _state = {
            zoomMode: visible,
            selectedImage: 0,
        }

        if(image)
        {
            const imageIndex = _.findIndex(this.state.gallery, (item) => item.source.uri == image.source.uri)
            
            if(imageIndex != 0)
            {
                _state.selectedImage = imageIndex
            }
        }

        this.setState({..._state})
    }

    componentDidMount = async () => {
        this.location = LocationStore.getState().location;
        
        const productId = this.props.navigation.getParam('id', -1);

        if(productId != this.lastProductId)
        {
            await this.retrieveProduct(this.location, productId, this.props.navigation.getParam('searchBy', SEARCH_BY.CODE));
            this.lastProductId = productId;
        }
    }

    _onNavigationDidFocus = async () =>
    {
        this.location = LocationStore.getState().location;
        
        const productId = this.props.navigation.getParam('id', -1);

        if(productId != this.lastProductId)
        {
            await this.retrieveProduct(this.location, productId, this.props.navigation.getParam('searchBy', SEARCH_BY.CODE));
            this.lastProductId = productId;
        }
    }

    addCart() {
        let quantity = 1
        AddToShopCart(this.state.product, quantity).then(res => {
            DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: res.totalProductsInCart + quantity})
        })
    }

    render()
    {

        const {product} = this.state

        let hasDiscount = false
        
        if(product && (product.discount > 0 && !IsExcludedCategory(product.subgrupo36))) hasDiscount = true

        
        return(
            <View style={styles.container}>

                <NavigationEvents onDidFocus={payload => this._onNavigationDidFocus(payload)} />

                <Header navigation={this.props.navigation} />

                
                <ScrollView>

                    <HeaderWithTitleAndBackButton title='Detalle' subtitle = "Regresar al Listado" onPress={() => this.props.navigation.goBack()} />

                    {this.state.loading && <ActivityIndicator color={COLORS._1B42CB} />}
                    {!this.state.loading && product &&
                    <View style={styles.scrollContainer}>
                        
                        {hasDiscount && 
                        <View style={styles.vidaSanaIndicatorContainer}>
                            <Image source={require("../../../assets/icons/oferta2.png")} style={styles.discountImg} resizeMode="contain"/>
                            <Text style={styles.productDetailsPricePercentDiscount}>{`${product.discount}%`}</Text>
                        </View>
                        }
                        
                        {!this.state.loading &&
                        <Carousel  
                            imageStyle = {{height: 240,}}
                            images={this.state.gallery}
                            imageResizeMode={'contain'} 
                            dotsColor={COLORS._1B42CB}
                        />}

                        
                      
                        <Text style={styles.proveedor}>{product.proveedor}</Text>
                        <View style={styles.productNameContainer}>
                            <Text style={styles.productNameText}>{CapitalizeWord(product.name)}</Text>
                        </View>
                        

                        {hasDiscount &&
                        <View style={styles.discountContainer}>
                            <Text style={styles.productDetailsPriceText}>{ToCurrencyFormat(product.antes)}</Text>
                            
                        </View>}

                        <Text style={styles.productPriceText}>{ToCurrencyFormat(product.price)}</Text>

                        {product.unit != '' && <Text style={styles.pricePerUnitText}>{CapitalizeWords(product.unit)}</Text>}

                        <TouchableOpacity style={styles.footerAddToCartButton} onPress={this.addCart.bind(this)}>
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


                {this.state.product &&
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.zoomMode}
                    onRequestClose={() => {}}
                >
                    <ZoomImage images = {this.state.gallery} selected = {this.state.selectedImage} onClose={this.zoomProductVisible.bind(this, 0, false)} />
                </Modal>}

            </View>
        )
    }

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