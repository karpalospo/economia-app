import React from "react";
import { View, StyleSheet, FlatList, AsyncStorage, Alert, Text } from "react-native";
import { NavigationEvents } from "react-navigation";
import _ from "lodash";

import { COLORS, FONTS, BAG_TAX_ID, DELIVERY_TAX_ID, ORDER_STATUS } from "../../utils/constants";

import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { API } from "../../services/service";
import { FormatOrder, FormatProductOrder } from "../../utils/formatter";
import { OrderCard } from "../../components/orders/OrderCard";
import EmptyState from "../../components/empty_state/EmptyState";
import { SetProductsInShopCart, AddToShopCart, } from "../../utils/shopcartHelper";
import { SafeAreaView } from 'react-navigation';
import HeaderSimple from "../../components/HeaderSimple";


export default class OrderHistoryView extends React.Component
{
    state = {
        loading: false,

        document: '',

        orders: [],
    }

    onNavigationDidFocus = async () => 
    {
        await this.setProfile()
    }

    async setProfile()
    {
        const auth = JSON.parse(await AsyncStorage.getItem('auth'));

        if(auth)
        {
            this.setState({document: auth.document,}, async () =>
            {
                await this.getOrderHistory()
            })
        }
        else
        {
            Alert.alert('Atención', 'Aún no has iniciado sesión.', [
                {text: 'Iniciar sesión', onPress: () => { this.props.navigation.navigate('SignIn') }},
                {text: 'Volver', onPress: () => { this.props.navigation.navigate('Home') }},
            ],
            {cancelable: false})
        }
    }

    onTapOrder = (order) =>
    {
        this.props.navigation.navigate('OrderDetails', {...order})
    }


    getOrderHistory = async () => 
    {
        this.setState({loading: true})
        const res = await API.GET.RetrieveOrderHistory(this.state.document)
        
        let orders = []
        if(!res.error)
        {
            orders = this.formatOrderHistory(res.message.data)
        }

        orders = orders.sort(function(a, b) {
            return a.date < b.date ? 1 : -1;
        })

        this.setState({orders, loading: false})
    }

    

    purchaseAgain = async (ref) => 
    {
        let currentOrder = {}
        this.state.orders.forEach(item => {
            if(item.referenceNumber == ref) currentOrder = item
        })
   

        this.setState({loading: true})
        await SetProductsInShopCart([])
        await this.addProductsToCart(currentOrder.products, 0, currentOrder.products.length)
        this.setState({loading: false}, () => {
            this.props.navigation.navigate('ShopCart', {reload: true})
        })

    }

    addProductsToCart = async (products, currentProduct, totalProducts) =>
    {
        if(products[currentProduct].id != BAG_TAX_ID && products[currentProduct].id != DELIVERY_TAX_ID)
        {
            delete products[currentProduct].oldPrice
            await AddToShopCart(products[currentProduct], products[currentProduct].qty)
        }

        if((currentProduct + 1) == totalProducts) return
        else await this.addProductsToCart(products, (currentProduct + 1), totalProducts)
      
    }


    formatOrderHistory = (orders) =>
    {
        let formatedOrders = []

        for (let index = 0; index < orders.length; index++) {

            
            let order = FormatOrder(orders[index])
            const parsedTotal = parseFloat(order.total)
            order.total = isNaN(parsedTotal) ? 0 : parsedTotal 

            const orderIndex = _.findIndex(formatedOrders, {reference: order.reference})

            if(orderIndex == -1)
            {
                order.products = [FormatProductOrder(orders[index])]
                formatedOrders.push(order)
            }
            else
            {
                formatedOrders[orderIndex].products.push(FormatProductOrder(orders[index]))
                formatedOrders[orderIndex].total += order.total
            }
            
        }
        
        return formatedOrders
    }

    render()
    {
        return(
            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>

                <NavigationEvents onDidFocus={this.onNavigationDidFocus.bind(this)} />

                <HeaderSimple onBack={() => this.props.navigation.goBack()} />

                <View style={{flex: 1, backgroundColor:"#f2f2f2"}}>

                <Text style={styles.title}>Mis Compras</Text>
                {this.state.loading && <FullWidthLoading />}

   
                {(this.state.orders.length == 0 && !this.state.loading) &&
                <View style={styles.emptyStateContainer}>
                    <EmptyState mainTitle = "No has realizado compras aún..." />
                </View>}

                <FlatList
                    keyExtractor={(item, index) => `order_${index}`}
                    data={this.state.orders}
                    extraData={this.state}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.orderItemContainer}>
                                <OrderCard reference={item.referenceNumber} onBuyAgain={this.purchaseAgain.bind(this)} totalAmount = {item.total} date = {item.createDate} image={item.products[0].image} onPress = {this.onTapOrder.bind(this, item)} />
                            </View>
                        )
                    }}
                />
                </View>

            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    title: {fontSize:21, color: "#333", padding:15, textAlign:"center"},
    backButtonContainer: {width: 15, height: 15},

    productsContainer: {justifyContent: 'space-around', width: '100%'},
    productContainer: { marginTop: 10, justifyContent: 'center'},

    categorySectionContainer: {width: '100%'},

    productsWrapper: {width: '100%', flexWrap: 'wrap', marginVertical: 10, paddingHorizontal: 15,},

    orderItemContainer: {width: '100%', paddingHorizontal: 10, marginVertical: 5,},

    emptyStateContainer: { width: '100%', paddingHorizontal: 15 },
})