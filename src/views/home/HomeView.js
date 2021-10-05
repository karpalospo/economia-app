import React from "react";
import { View, StyleSheet, FlatList, Linking, Modal, AsyncStorage, DeviceEventEmitter, TouchableOpacity, Text, Image } from "react-native";
import _ from "lodash";
import Header from "../../components/header/Header";
import { COLORS, ON_SELECT_LOCATION_EVENT, SHOW_LOCATION_EVENT, SET_CATEGORIES_EVENT, BEST_SELLER, FONTS } from "../../utils/constants";
import SectionContainer from "../../components/SectionContainer";
import ProductCard from "../../components/product/VerticalProductCard";
import Carousel from "../../components/Carousel";
import { API, SEARCH_BY } from "../../services/service";
import { FormatProduct, FormatGroupCategoryItem } from "../../utils/formatter";
import LocationStore from "../../reducers/location.reducer";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { sortByKey} from "../../utils/helper";
import { CategoryIconCard } from "../../components/category/CategoryIconCard";

export default class Home extends React.Component
{
    state = {

        sectionMarginTop: 0,

        refreshing: false,
        loadingGallery: true,
        loadingCategories: true,
        loadingOffers: true,
        loadingBestSeller: true,

        categoryGallery: [],

        categoryGroups: [],

        categories: [],

        featuredProducts: [],

        bestSellers: [],

        sponsoredBrands: [],

        ads: null,

        selectedProduct: {},

        firstTimeInAppVisible: false,

        // Recent order
        showRecentOrderToast: false,
        lastOrder: null,
        informativeBannerVisible: false,
    }

    async componentDidMount()
    {
        // Event listeners
        this.handleOnSelectLocation = DeviceEventEmitter.addListener(ON_SELECT_LOCATION_EVENT, this.onSelectLocation)

        if(this.location)
        {
            if(LocationStore.getState().location != this.location)
            {
                await this.initializeComponent();
            }
        }
        else
        {
            await this.checkLocation()
        }


    }


    UNSAFE_componentWillUnmount()
    {
        if(this.handleOnSelectLocation)
        {
            this.handleOnSelectLocation.remove()
        }

    }

    onLayoutHeader = (layout) => 
    {
        this.setState({sectionMarginTop: layout.nativeEvent.layout.height})
    }

    initializeComponent = async () =>
    {
        await this.checkFirstTimeInApp()
        this.retrieveCategories()
        this.retrieveOffers()
        this.retrieveBestSellers()

    }

    checkFirstTimeInApp = async () => 
    {
        const firstTime = await AsyncStorage.getItem('firstTime');
        
        if(!firstTime)
        {
            this.setState({firstTimeInAppVisible: true}, async () => {
                await AsyncStorage.setItem('firstTime', "true")
            })
        }
        else
        {
            await AsyncStorage.setItem('disclaimer_c', "1")
            /*const disclaimer_c = await AsyncStorage.getItem("disclaimer_c")
            if(!disclaimer_c)
            {
                this.setState({informativeBannerVisible: true}, async () => {
                    await AsyncStorage.setItem('disclaimer_c', "1")
                })
            }*/
        }

    }

    checkLocation = async () =>
    {
        const location = JSON.parse(await AsyncStorage.getItem('location'));
        
        if(location)
        {
            this.location = location.id;

            await this.initializeComponent()
        }
        else
        {   
            DeviceEventEmitter.emit(SHOW_LOCATION_EVENT)
        }
    }

    onSelectLocation = async (params) => 
    {   
        if(this.location != params.selectedLocation.id)
        {
            this.location = params.selectedLocation.id;
            await this.initializeComponent()
        }
    }


    retrieveCategories = async () => 
    {
        this.setState({loadingCategories: true});
        const res = await API.GET.RetrieveGroupsOfCategories()
        
        let categoryGroups = []
        if(!res.error)
        {
            for (let i = 0; i < res.message.data.length; i++) {
                const group = res.message.data[i]

                categoryGroups.push(FormatGroupCategoryItem(group))
            }

            DeviceEventEmitter.emit(SET_CATEGORIES_EVENT, {categoryGroups})
        }

        this.setState({categoryGroups, loadingCategories: false,});
    }

    retrieveOffers = async () =>
    {
        this.setState({loadingOffers: true});

        let featuredProducts = [];
        const res = await API.GET.RetrieveOffers(this.location, 20);

        if(!res.error)
        {   
            if(typeof(res.message) != "string")
            {
                const res2 = await API.POST.PerformRetrieveProductsFromCodeList(res.message.map(item => item.codigo), this.location);

                if(typeof(res2.message) != "string")
                {
                    let items = sortByKey([...res2.message.data], "Porcentaje", "desc")

                    for (let i = 0; i < items.length; i++) {
                        const element = items[i]
                        if(!element.codigo) continue
                        featuredProducts.push(FormatProduct(element));
                    }
                }
            }
        }

        this.setState({featuredProducts, loadingOffers: false});
    }

    retrieveBestSellers = async () =>
    {
        this.setState({loadingBestSeller: true});

        let bestSellers = [];
        const res = await API.GET.RetrieveTopOffers(this.location);
        
        if(!res.error)
        {
            for (let i = 0; i < res.message.length; i++) {
                const element = res.message[i];
                bestSellers.push(FormatProduct(element));
            }
        }

        this.setState({bestSellers, loadingBestSeller: false});
    }



    onTapCategory = (id, title, categories) => 
    {
        this.props.navigation.navigate('GroupOfCategories', {title, id, categories});
    }
    
    onTapSingleProduct = (productId, productName) => 
    {
        this.props.navigation.navigate({
            routeName: 'ProductDetail', 
            params: {id: productId, searchBy: SEARCH_BY.CODE, name: productName,},
            key: `product_${productId}`,
        })
    }

    onTapSeeAllFeaturedProducts = () => 
    {
        if(!this.state.loadingOffers)
        {
            this.props.navigation.navigate('BestSellerProducts', {type: BEST_SELLER.OFFERS})
        }
    }


    onTapSeeAllSponsoredBrands = () => 
    {
        this.props.navigation.navigate('AllSponsoredBrands');
    }


    onTapSeeAllBestSellers = () => 
    {
        if(!this.state.loadingBestSeller)
        {
            this.props.navigation.navigate('BestSellerProducts', {title: 'LO MÁS COMPRADO', type: BEST_SELLER.SELLERS})
        }
    }

    onTapSingleSponsoredBrand = (brandId, brandName, brandType, brandValue) =>
    {
        this.props.navigation.navigate('SponsoredBrand', {title: brandName, id: brandId, type: brandType, value: brandValue});
    }




    onRefresh = async () => 
    {
        this.setState({refreshing: true})
        await this.initializeComponent()
        this.setState({refreshing: false})
    }


    onAcceptVidaSanaTerms = () => 
    {
        this.setState({firstTimeInAppVisible: false}, () => {
            this.props.navigation.navigate('VidaSana', {signUp: true})
        })
    }

    // TODO: Order on the way
    onPressRecentOrderDetails = () =>
    {
        if(this.state.lastOrder)
        {
            this.props.navigation.navigate('OrderDetails', {...this.state.lastOrder})
            this.setState({lastOrder: null})
        }
        else
        {
            console.log("no last order", this.state.lastOrder);
        }
    }

    onCloseRecentOrderToast = () =>
    {
        this.setState({lastOrder: null})
    }
   
      
    render()
    {
        return(
            <View style={styles.container}>

                <Header navigation={this.props.navigation} />

                <FlatList
                    keyExtractor={(item, index) => `item_${index}`}
                    data={[0]}
                    showsHorizontalScrollIndicator={false}
                    renderItem={() => 

                        <View>
                            
                            <Carousel
                                dotsColor={COLORS._1B42CB}
                                images={[
                                    {source: { uri:"https://staticimperacore.net/economia/banners/AmorAmistad2021-BannerAppP.jpg"}},
                                    {source: { uri:"https://staticimperacore.net/economia/banners/DescuentoPG-BannerApp@2x.jpg"}},
                                    {source: { uri:"https://staticimperacore.net/economia/banners/Banners_Pedialyte_1024X512.jpg"}},

                                ]}
                            />

                            <View style={styles.categoriesContainer}>

                                {this.state.loadingCategories &&
                                <FullWidthLoading />
                                }

                                {!this.state.loadingCategories &&
                                <FlatList
                                    keyExtractor={(item, index) => `groups_${index}`}
                                    horizontal={true}
                                    data={this.state.categoryGroups}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => 
                                        <CategoryIconCard category={item} onTapCategory={this.onTapCategory.bind(this)} />
                                    }
                                />}

                            </View>
            
                            <SectionContainer sectionTitle = 'Ahorra más con' mainTitle = 'Las mejores ofertas' showAllButton = {true} onPressShowAll = {this.onTapSeeAllFeaturedProducts.bind(this)}>
                            
                                {this.state.loadingOffers && <FullWidthLoading />}

                                {!this.state.loadingOffers &&
                                <FlatList
                                    keyExtractor={(item, index) => `featuredProducts_${index}`}
                                    numColumns={2}
                                    data={this.state.featuredProducts}
                                    renderItem={({ item, index }) => 
                                        <ProductCard image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)} />
                                    }
                                />}

                                <TouchableOpacity onPress={this.onTapSeeAllFeaturedProducts} style={{marginVertical: 30, marginHorizontal: 40, borderRadius:30, backgroundColor: COLORS._1B42CB}}>
                                    <Text style={{textAlign:"center", padding:10, fontSize: 16, color: "white", fontFamily: FONTS.BOLD}}>Ver Todas Las Ofertas</Text>
                                </TouchableOpacity>
                            </SectionContainer>
                        </View>
                    }
                />

                <TouchableOpacity style={styles.botonFlotante} onPress={() => {Linking.openURL(`tel:${6053699090}`)}}>
                    <Image source={require("../../../assets/icons/operador.png")} style={{width:55, height:55}} resizeMode="contain"/>
                    <Text style={styles.ayudaText}>Ayuda</Text>
                </TouchableOpacity>
            </View>
        )
    }


 
}

const styles = StyleSheet.create({
    container: {flex: 1, position:"relative"},
    botonFlotante: {width:65, height:65, borderRadius: 31, backgroundColor:"white", position: "absolute", bottom: 18, right: 10, justifyContent:"center", alignItems:"center", elevation: 5, shadowColor: COLORS._BABABA, shadowOffset: {width: 0, heigth: 1}, shadowOpacity: 7, shadowRadius: 15,},
    ayudaText: {backgroundColor:"#eee", position:"absolute", width:60, height:17, left:0, bottom:-8, color:"#333", textAlign:"center", fontSize: 12, borderRadius:7, borderWidth: 0.5, borderColor:"#aaa"},
    categoriesContainer: {width: '100%', backgroundColor: 'white', paddingBottom: 10, paddingTop:10}, 
    categoriesTitleText: {margin: 15, fontSize: 14, fontFamily: FONTS.REGULAR, color: COLORS._A5A5A5}, 
    categoryItemConteiner: {alignItems: 'center', width: 100, height: 120, padding: 5}, 
    categoryItemImageContainer: {width: 70, height: 70, borderRadius: 35, overflow: 'hidden',},
    categoryItemImage: {width: '100%', height: '100%'},
    categoryItemNameText: {fontSize: 10, color: COLORS._657272, textAlign: 'center', marginTop: 5, fontFamily: FONTS.REGULAR},

    featuredProductItemContainer: {margin: 10},

    sponsoredBrandItemContainer: {margin: 10},

    bestSellerItemContainer: {margin: 10},

    loadingIndicatorContainer: {width: '100%', alignItems: 'center', padding: 15, },
})