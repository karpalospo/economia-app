import React from "react";
import { View, StyleSheet, FlatList, SectionList, Dimensions, Linking, DeviceEventEmitter, Modal, AsyncStorage } from "react-native";
import { COLORS, ADS_GALLERY, ON_MODIFY_CART_EVENT, BRANDS, } from "../../utils/constants";
import Carousel from "../../components/Carousel";
import AdvertisementSection from "../../components/ads/AdvertisementSection";
import ProductCard from "../../components/product/VerticalProductCard";
import { PANEL_API, SEARCH_BY, API } from "../../services/service";
import { FormatBannerItem, FormatBrandBanner, FormatProduct } from "../../utils/formatter";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { AddToShopCart } from "../../utils/shopcartHelper";
import { AddToCart } from "../../components/shop_cart/AddToCart";
import EmptyState from "../../components/empty_state/EmptyState";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";

const {width} = Dimensions.get('screen')
export default class SponsoredBrand extends React.Component
{
    state = {
        loading: false,

        gallery: [],

        products: [],

        addToCartVisible: false,
        selectedProduct: {},

        ads: null,
    }

    async componentDidMount()
    {
        this.lastPage = -1
        this.page = 0

        this.retrieveBrandBanners()
        if(this.props.navigation.getParam('type', BRANDS.PRODUCT_SEARCH) == BRANDS.PRODUCT_SEARCH)
        {
            await this.getBrandProducts()
        }
        else if(this.props.navigation.getParam('type', BRANDS.PRODUCT_SEARCH) == BRANDS.PRODUCT_CODE) 
        {
            await this.getBrandSingleProduct()
        }
        this.retrieveAds()
    }

    getBrandProducts = async () =>
    {
        this.setState({loading: true})
        const location = JSON.parse(await AsyncStorage.getItem('location'))
        const res = await API.GET.RetrieveProductFromSearch (location.id, this.props.navigation.getParam('value', ''))
        let products = []
        if(!res.error)
        {
            for (let index = 0; index < res.message.data.length; index++) {
                if(!('Nro' in res.message.data[index]))
                {
                    products.push(FormatProduct(res.message.data[index]));
                }
            }
        }

        this.setState({loading: false, products})
    }

    getBrandSingleProduct = async() => 
    {
        this.setState({loading: true})
        const location = JSON.parse(await AsyncStorage.getItem('location'))
        const res = await API.GET.RetrieveProductFromCode(location, barCodeRes.message[0].codigo)
        let products = []
        if(!res.error)
        {   
            products = [FormatProduct(res.message.data[0])]
        }
        this.setState({loading: false, products})
    }

    onTapAds = async (banner) => 
    {
        if(await Linking.canOpenURL(banner.url))
        {
            Linking.openURL(banner.url)
        }
    }

    retrieveBrandBanners = async () => 
    {        
        const res = await PANEL_API.GET.RetrieveBrandBanners(this.props.navigation.getParam('id', ''))
        
        let gallery = []

        if(!res.error)
        {
            for (let index = 0; index < res.message.data.length; index++) {
                gallery.push(FormatBrandBanner(res.message.data[index]))
            }
        }
        
        this.setState({gallery})
    }


    retrieveAds = async () =>
    {
        const ads = await this.retrieveMedia(ADS_GALLERY.PUBLICIDAD)

        this.setState({ads})
    }


    retrieveMedia = async (media) => 
    {
        let gallery = []

        const res = await PANEL_API.GET.RetrieveBanners(media, false)

        if(!res.error)
        {
            for (let i = 0; i < res.message.data.length; i++) {
                const element = res.message.data[i];
                gallery.push(FormatBannerItem(element));
            }
        }

        return gallery
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

    onTapBannerGallery = async (banner) => 
    {
        if(await Linking.canOpenURL(banner.url))
        {
            Linking.openURL(banner.url)
        }
    }

    render()
    {
        return(
            <View style={styles.container}>
                
                <SectionList
                    keyExtractor={(item, index) => `section_${index}`}
                    renderItem={({ item, index, section }) => <View />}
                    extraData={this.state}
                    sections={[
                        { title: 'Title, gallery and categories', data: [{}], renderItem: this.overrideCategoriesSection.bind(this) },
                        { title: 'Products', data: [{}], renderItem: this.overrideProductsSection.bind(this) },
                        { title: 'Ads', data: [{}], renderItem: this.overrideAdsSection.bind(this) },
                    ]}
                />

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.addToCartVisible}
                    onRequestClose={() => {}}
                >
                    <AddToCart 
                        name = {this.state.selectedProduct.name}
                        image = {this.state.selectedProduct.image} 
                        price = {this.state.selectedProduct.price}
                        onCloseModal = {() => {this.setState({addToCartVisible: false})}}
                        onPressAddToCart = {this.onAddProductToCart.bind(this)}
                    />
                </Modal>

            </View>
        )
    }


    overrideCategoriesSection = ({ item, index, section: { title, data } }) =>
    {
        return(
            <View style={styles.categorySectionContainer}>
                
                <HeaderWithTitleAndBackButton title='MARCA PATROCINADORA' subtitle = {this.props.navigation.getParam('title', '')} onPress={() => this.props.navigation.goBack()} />

                {/* Gallery  */}
                {this.state.gallery.length > 0 &&
                <View style={styles.categoryGalleryContainer}>
                    <Carousel 
                        imageContainerStyle={styles.carouselImageContainer}
                        images={this.state.gallery}
                        imageResizeMode={'cover'} 
                        dotsColor={COLORS._1B42CB}
                        onTapImage={this.onTapBannerGallery.bind(this)}
                        autoscroll={true}
                        showIndicator={false}
                    />
                </View>}

            </View>
        )
    }

    overrideProductsSection = ({ item, index, section: { title, data } }) => 
    {
        if(!this.state.loading && this.state.products.length == 0)
        {
            return(
                <View style={styles.emptyStateContainer}>
                    <EmptyState mainTitle='¡Lo sentimos!' subTitle={`No hay productos asociados a ${this.props.navigation.getParam('title', '')}.`} />
                </View>
            )
        }

        return(
            <View style={styles.categoryProductsWrapper}>  
                <FlatList
                    numColumns={2}
                    columnWrapperStyle={styles.categoryProductsContainer}
                    keyExtractor={(item, index) => `product_${index}`}
                    data={this.state.products}
                    extraData={this.state}

                    // onEndReached={this.handleLoadMore}
                    // onEndReachedThreshold={0.9}
                    ListFooterComponent={this.renderFooter}

                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.categoryProductContainer}>
                                <ProductCard width={(width * .45)} image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)} onAddProductToCart={this.onTapAddToCart.bind(this, item)}/>
                            </View>
                        )
                    }}
                />  
            </View>
        )
    }

    overrideAdsSection = ({ item, index, section: { title, data } }) =>
    {
        if(!this.state.ads)
        {
            return null
        }

        return(
            <AdvertisementSection images={this.state.ads} onPressAds = {this.onTapAds.bind(this)} />
        )
    }

    handleLoadMore = async () =>
    {
        if(!this.state.loading && this.lastPage !== this.page)
        {
            await this.getBrandProducts()
        }
    }

    renderFooter = () =>
    {
        if(!this.state.loading)
        {
            return null
        } 

        return (<FullWidthLoading />)
    }

}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._F4F4F4},
        
    backButtonContainer: {width: 15, height: 15},

    carouselImageContainer: {borderRadius: 10, overflow: 'hidden'},

    categoryProductsContainer: {justifyContent: 'space-around', width: '100%'},
    categoryProductContainer: { marginTop: 10, justifyContent: 'center'},

    categorySectionContainer: {width: '100%', marginTop: '6%'},

    categoryGalleryContainer: {width: '100%', padding: 15,},

    categoryProductsWrapper: {width: '100%', flexWrap: 'wrap', marginVertical: 10, paddingHorizontal: 10,},

    emptyStateContainer: {alignSelf: 'center', width: '80%', alignItems: 'center', marginBottom: 10}
})