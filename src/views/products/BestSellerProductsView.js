import React from "react";
import { View, StyleSheet, Text, FlatList, Dimensions } from "react-native";
import { COLORS, BEST_SELLER, ON_MODIFY_CART_EVENT, ADS_GALLERY, FONTS } from "../../utils/constants";
import ProductCard from "../../components/product/VerticalProductCard";
import { API, SEARCH_BY } from "../../services/service";
import LocationStore from "../../reducers/location.reducer";
import { FormatProduct, FormatBannerItem } from "../../utils/formatter";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { sortByKey} from "../../utils/helper";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";
import Header from '../../components/header/Header';

const {width} = Dimensions.get('screen')

export class BestSellerProductsView extends React.Component 
{

    state = {

        loading: false,

        products: [],

        addToCartVisible: false,
        selectedProduct: {},

        ads: null,
    }


    async componentDidMount()
    {
        this.location = LocationStore.getState().location
        await this.getOffers()
    }


    getOffers = async () => 
    {
        let res = {};

        this.setState({loading: true})
        if(this.props.navigation.getParam('type', BEST_SELLER.OFFERS) == BEST_SELLER.OFFERS)
        {
            res = await API.GET.RetrieveOffers(this.location, 150)
        }
        else
        {
            res = await API.GET.RetrieveTopOffers(this.location, 150)
        }

        let products = [];

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
                        products.push(FormatProduct(element));
                    }
                }
            }
        }


        this.setState({products, loading: false})
    }



    onTapSingleProduct = (productId, productName) => 
    {
        this.props.navigation.navigate({
            routeName: 'ProductDetail', 
            params: {id: productId, searchBy: SEARCH_BY.CODE, name: productName,},
            key: `product_${productId}`,
        })
    }


    render()
    {
        return(
            <View style={styles.container}>

                <Header navigation={this.props.navigation} />
                
                <HeaderWithTitleAndBackButton title='Ahorra más con' subtitle = {this.props.navigation.getParam('title', 'MEJORES OFERTAS')} onPress={() => this.props.navigation.goBack()} />

                <View>  

                    {this.state.loading && <FullWidthLoading />}

                    <FlatList
                        numColumns={2}
                        keyExtractor={(item, index) => `product_${index}`}
                        data={this.state.products}
                        renderItem={({ item, index }) => 
                            <ProductCard image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)}/>
                        }
                    />  
                </View>


            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {flex: 1},

    productsContainer: {justifyContent: 'space-around', width: '100%'},
    productContainer: { marginTop: 10, justifyContent: 'center'},

    categorySectionContainer: {width: '100%'},

    productsWrapper: {width: '100%', flexWrap: 'wrap', marginTop: 5, marginBottom: 15, paddingHorizontal: 10,},
})