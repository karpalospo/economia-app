import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Image, FlatList, Dimensions, AsyncStorage, Alert, DeviceEventEmitter, Modal, Linking, BackHandler, Platform } from "react-native";
import { NavigationEvents, } from "react-navigation";

import { COLORS, SHOW_LOCATION_EVENT, ON_MODIFY_CART_EVENT, PLATFORM, ADS_GALLERY, REST, SIGNIN_EVENT, FONTS } from "../../utils/constants";
import { JoinVidaSana } from "../../components/vida_sana/JoinVidaSana";
import Header from "../../components/header/Header";
import AdvertisementSection from "../../components/ads/AdvertisementSection";
import ProductCard from "../../components/product/VerticalProductCard";
import Carousel from "../../components/Carousel";
import { FullScreenLoading } from "../../components/loading/FullScreenLoading";
import { VIDA_SANA_API, SEARCH_BY, API, PANEL_API } from "../../services/service";
import { FormatProduct, FormatBannerItem } from "../../utils/formatter";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import LocationStore from "../../reducers/location.reducer";
import SessionStore from "../../reducers/session.reducer";
import { AddToShopCart } from "../../utils/shopcartHelper";
import { AddToCart } from "../../components/shop_cart/AddToCart";
import { SignInCard } from "../../components/signin/SignInCard";
import { MissingFieldsForm } from "../../components/vida_sana/MissingFieldsForm";
import { RegisterForPushNotificationsAsync } from "../../utils/expo_notification/expoPushNotification";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";

const {height, width} = Dimensions.get('screen')
const platform = Platform.OS
export default class VidaSanaView extends React.Component
{  
    static navigationOptions = {
        headerTitle: () => <Header navigation={this.props.navigation} />,
        headerRight: () => (
          <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
          />
        ),
    };

    state = {

        loading: true,
        loadingProducts: true,
        refreshing: false,
        
        sectionMarginTop: 0,
        
        showJoinVidaSana: false,
        
        selectedCategory: 0,
        
        availableCategories: [
            {name: 'Todos', id: 1},
        ],
        
        categoryGallery: [],
        
        categoryProducts: [],
        
        ads: null,
        
        addToCartVisible: false,
        selectedProduct: {},

        gender: true,
        address: '',

        profile: {
            email: '',
            password: '',
            name: '',
            document: '',
            dateOfBirth: '',
            phone: '',
            cellphone: '',
            address: '',
            gender: '',
        },
        signInVisible: false,
        signInError: false,
        
        vidaSanaFormVisible: false,

        signUpOnLoad: this.props.navigation.getParam('signUp', false),
    }

    async componentDidMount()
    {
        await this.checkLocation()
        await this.getVidaSanaProducts()
        //this.retrieveAds()
        
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(this.state.addToCartVisible || this.state.zoomMode)
            {
                return true
            }
            return false
        })
    }

    UNSAFE_componentWillUnmount()
    {
        this.backHandler.remove();
    }



    checkLocation = async () =>
    {
        const location = JSON.parse(await AsyncStorage.getItem('location'));
        
        if(location)
        {
            this.location = location.id;
        }
        else
        {   
            DeviceEventEmitter.emit(SHOW_LOCATION_EVENT)
        }
    }



    getVidaSanaProducts = async () => 
    {
        
        
        if(this.state.categoryProducts.length == 0 || this.state.refreshing)
        {
            this.setState({loadingProducts: true})

            const res = await API.GET.RetrieveOffers(this.location, 200);

            let categoryProducts = []
    
            if(!res.error)
            {
                for (let i = 0; i < res.message.length; i++) {
                    const element = res.message[i];
                    categoryProducts.push(FormatProduct(element));
                }
            }
    
            this.setState({loadingProducts: false, refreshing: false, categoryProducts})
        }
    }


    showVidaSanaForm = (visible) => 
    {
        this.setState({vidaSanaFormVisible: visible})
    }

    onAccept = (address, gender) => 
    {   
        this.setState({vidaSanaFormVisible: false}, async () => {
            await this.getUserInformation(true, address, gender ? "M" : "F")
        })
    }

    onSelectCategory = (selectedCategory, categoryId) => 
    {
        this.setState({selectedCategory})
    }

    onTapSingleProduct = (productId, productName) => 
    {
        this.props.navigation.navigate({
            routeName: 'ProductDetail', 
            params: {id: productId, searchBy: SEARCH_BY.CODE, name: productName,},
            key: `product_${productId}`,
        })
    }

    onTapAddToCart = (selectedProduct) => 
    {
        this.setState({selectedProduct, addToCartVisible: true})
    }

    onAddProductToCart = (quantity) => 
    {
        AddToShopCart(this.state.selectedProduct, quantity).then(res => {
            DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: res.totalProductsInCart + quantity})
        }) 
        this.setState({addToCartVisible: false, })
    }


    onRefresh = async () => 
    {
        this.setState({refreshing: true}, async () => {
            await this.getVidaSanaProducts()
        })
    }

    onTapAds = async (banner) => 
    {
        if(await Linking.canOpenURL(banner.url))
        {
            Linking.openURL(banner.url)
        }
    }
    



    render()
    {
        return (
            <View style={styles.container}>
                
                <Header navigation={this.props.navigation} />

                <FlatList
                    keyExtractor={(item, index) => `item_${index}`}
                    data={[0]}
                    renderItem={() => 

                        <View>

                            <HeaderWithTitleAndBackButton title='Recomendados' subtitle = 'Las Mejores Ofertas' onPress={() => this.props.navigation.goBack()} />
                   
                            <View> 
                                {this.state.loadingProducts && <FullWidthLoading />}

                                <FlatList
                                    numColumns={2}
                                    keyExtractor={(item, index) => `product_${index}`}
                                    data={this.state.categoryProducts}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View>
                                                <ProductCard image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)} onAddProductToCart={this.onTapAddToCart.bind(this, item)} />
                                            </View>
                                        )
                                    }}
                                />  
                            </View>

                        </View>
                    }
                />
                {/* Add to cart modal 
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.addToCartVisible}
                    onRequestClose={() => {}}
                >
                    <AddToCart 
                        name = {this.state.selectedProduct.name}
                        image = {this.state.selectedProduct.image} 
                        price = {Math.round(this.state.selectedProduct.price - Math.round(this.state.selectedProduct.price * this.state.selectedProduct.discount))}
                        onCloseModal = {() => {this.setState({addToCartVisible: false})}}
                        onPressAddToCart = {this.onAddProductToCart.bind(this)}
                    />
                </Modal>
*/}

            </View>
        )
    }


}


const styles = StyleSheet.create({

    container: {flex: 1},

    sectionListContainer: {width: '100%'},

    backButtonContainer: {width: 15, height: 15},

    carouselImageContainer: {borderRadius: 10, overflow: 'hidden'},

    categoryItemContainer: {width: 100, margin: 5, alignItems: 'center'},
    categoryItemButton: {justifyContent: 'center', height: 50, borderColor: COLORS._1B42CB, borderBottomWidth: 3,},
    categoryItemButtonText: {fontSize: 13, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR },

    categoryProductsContainer: {justifyContent: 'space-around', width: '100%'},
    categoryProductContainer: { marginTop: 10, justifyContent: 'center'},


    categoryGalleryContainer: {width: '100%', padding: 15,},

    categoryProductsWrapper: {width: '100%', flexWrap: 'wrap', marginTop: 5, marginBottom: 15, paddingHorizontal: 10,},

    headerWrapper: {position: 'absolute', width: '100%',},
    headerContainer: {width: '100%', backgroundColor: COLORS._FFFFFF, paddingTop: platform == 'android' ? 10 : 0},


})