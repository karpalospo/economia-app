import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, DeviceEventEmitter, Image, Modal } from 'react-native';
import { NavigationEvents } from "react-navigation";

import { COLORS, ON_SELECT_LOCATION_EVENT, FONTS, ON_MODIFY_CART_EVENT } from '../../utils/constants';
import { API, SEARCH_BY } from '../../services/service';
import Header from '../../components/header/Header';
import EmptyState from '../../components/empty_state/EmptyState';
import LocationStore from '../../reducers/location.reducer';
import { FormatProduct } from '../../utils/formatter';
import { FullWidthLoading } from '../../components/loading/FullWidthLoading';
import ProductCard from "../../components/product/VerticalProductCard";
import { CalculateMarginTopForAndroid } from '../../utils/ui_helper';
import { sortByKey} from "../../utils/helper";
import { AddToCart } from "../../components/shop_cart/AddToCart";
import { AddToShopCart} from "../../utils/shopcartHelper";

export default class SearchProduct extends React.Component {

    state = {

        loading: false,
        loadingSuggestions: false,

        searchedProduct: "",
        productList: [],
        
        productSuggestions: [],

        headerHeight: 0,

        showSuggestions: true,

        shouldLookForSuggestions: true,

        addToCartVisible: false,
        selectedProduct: {},

    }

    async componentDidMount()
    {
        this.location = this.props.navigation.getParam('location', '');
        this.searchProducts(this.props.navigation.getParam('search', ''), this.location)
    }

    _onNavigationDidFocus = async () =>
    {
        this.location = this.props.navigation.getParam('location', '');
        this.searchProducts(this.props.navigation.getParam('search', ''), this.location)
    }

    onAddProductToCart = (quantity) => 
    {
        AddToShopCart(this.state.selectedProduct, quantity).then(res => {
            DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: res.totalProductsInCart + quantity})
        }) 

        this.setState({addToCartVisible: false, })
    }

    searchProducts = async (search, location, limit = 0) => 
    {
        //console.log(search, location)
        if(!search || search == "") return

        this.setState({loading: true, productList: []})
        const res = await API.POST.search(search, location);
        
        let productList = [];

        if(!res.error)
        {

            const res2 = await API.POST.PerformRetrieveProductsFromCodeList(res.message.products.map(item => item.id), location);
    
            if(typeof(res2.message) != "string")
            {
                let items = sortByKey([...res2.message.data], "Porcentaje", "desc")

                for (let i = 0; i < items.length; i++) {
                    const element = items[i]
                    if(!element.codigo) continue
                    productList.push(FormatProduct(element));
                }
            }
            
        }
        this.setState({loading: false, productList, searchedProduct: search})
 
    }

    onTapSingleProduct = (productId, productName) => 
    {
        this.props.navigation.navigate({
            routeName: 'ProductDetail', 
            params: {id: productId, searchBy: SEARCH_BY.CODE, name: productName,},
            key: `product_${productId}`,
        })
    }


    render() {

        return (
            <View style={styles.container}>

                <NavigationEvents onDidFocus={payload => this._onNavigationDidFocus(payload)} />

                <Header navigation={this.props.navigation} searchFunction={this.searchProducts}/>
 
                {this.state.loading && <FullWidthLoading />}
                
                {(this.state.searchedProduct != '' && this.state.productList.length === 0 && !this.state.loading) &&
                    <View style={styles.emptyContainer}>
                        <EmptyState mainTitle='¡Lo sentimos!' subTitle={`No encontramos resultados para '${this.state.searchedProduct}'`} />
                    </View>
                }

                {this.state.productList.length > 0 &&
                <View style={{flex: 1}}>
                    <View style={styles.resultadoCont}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                            <View style={{flexDirection:"row", width:100, alignItems:"center"}}>
                                <Image source={require('../../../assets/icons/volver.png')} tintColor="#444" resizeMode='contain' style={{width:16, height:16, marginRight:8}} />
                                <Text style={{color:"#666"}}>REGRESAR</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection:"row", alignItems:"center", paddingRight:10}}>
                            <Text style={{fontSize: 16, color: "#444", fontFamily: FONTS.BOLD}}>{this.state.productList.length}</Text>
                            <Text style={{fontSize: 16, color: "#666"}}> resultados para </Text>
                            <Text style={{fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.BOLD}}>{this.state.searchedProduct}</Text>
                        </View>
                    </View>
                    <FlatList
                        keyExtractor={(item, index) => `result_${index}`}
                        data={this.state.productList}
                        numColumns={2}
                        renderItem={({ item, index }) => {
                            return (
                                <ProductCard image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)} />
                            )
                        }}
                    />
                </View>
                }   
                
            </View>
        )
    }

    onLayoutHeader = (event) => 
    {
        const {height} = event.nativeEvent.layout;
        if(this.state.headerHeight === 0)
        {
            this.setState({headerHeight: height})
        }
    }


    _renderFooter = () => 
    {
        if(!this.state.loadingSuggestions)
            return null;
        
        return <FullWidthLoading />
    }


}

const styles = StyleSheet.create({

    container: {flex: 1},
    resultadoCont: {flexDirection:"row", paddingLeft:15, backgroundColor:"white", padding:8, borderBottomWidth: 0.5, borderBottomColor: "#999", justifyContent:"space-between"},
    loadingContainer: {width: '100%', alignItems: 'center', padding: 10},
    
    productsContainer: {justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', paddingHorizontal: '10%',marginTop: "0.1%"},
    productItemContainer: {width: '100%', padding: 10, backgroundColor: COLORS._FFFFFF, borderBottomWidth: .7, borderColor: COLORS._F4F4F4},

    headerWrapper: {position: 'absolute', top: 0, width: '100%', backgroundColor: 'white'},
    productSuggestionsContainer: {width: '100%', backgroundColor: 'white'},
    searchMatchItemContainer: {width: '100%', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 2, borderColor: COLORS._F4F4F4},
    searchMatchItemText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },

    emptyContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 15},
})