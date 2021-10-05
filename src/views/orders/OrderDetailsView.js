import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, AsyncStorage, Alert } from "react-native";

import { COLORS, FONTS, ORDER_STATUS } from "../../utils/constants";
import { FormatDate } from "../../utils/helper";
import { ProductCard } from "../../components/product/CartHorizontalProductCard";
import {  GlobalStyles } from "../../utils/ui_helper";
import { API } from "../../services/service";
import { FullScreenLoading } from "../../components/loading/FullScreenLoading";
import { FormatProductForOrderDetail } from "../../utils/formatter";
import EmptyState from "../../components/empty_state/EmptyState";
import HeaderSimple from "../../components/HeaderSimple";
import { SafeAreaView } from 'react-navigation';
import { ToCurrencyFormat, } from '../../utils/helper';



export default class OrderDetails extends React.Component
{

    state = {
        loading: false,

        createDate: this.props.navigation.getParam('createDate', FormatDate(new Date())),
        type: this.props.navigation.getParam('type', ''),
        reference: this.props.navigation.getParam('reference', ''),
        referenceNumber: this.props.navigation.getParam('referenceNumber', ''),
        total: this.props.navigation.getParam('total', 0),
        products: [],

        orderStatusMessages: {
            [ORDER_STATUS.PROCESSED]: {title: 'Tu pedido ha sido facturado', description: 'Nuestra droguería estará enviando muy pronto tu pedido. Está atento a las notificaciones.', image: require('../../../assets/icons/order_status/process.png')},
            [ORDER_STATUS.ASSIGNED]: {title: 'Domiciliario asignado', description: '', image: require('../../../assets/icons/order_status/assigned.png')},
            [ORDER_STATUS.REASSIGNED]: {title: 'Reasignando tu domiciliario', description: 'Estamos buscando un nuevo domiciliario para ti. Tu pedido estará llegando muy pronto.', image: require('../../../assets/icons/order_status/reassigned.png')},
            [ORDER_STATUS.ON_THE_WAY]: {title: '¡Tu pedido va en camino!', description: 'Nuestro domiciliario está yendo hacia ti.', image: require('../../../assets/icons/order_status/on_the_way.png')},
            [ORDER_STATUS.DELIVERED]: {title: 'Tu pedido ha sido entregado', description: 'Gracias por confiar en nosotros. Recuerda que siempre pensamos en tu bienestar.', image: require('../../../assets/icons/order_status/delivered.png')},
        },

        currentOrder:
        {
            status: ORDER_STATUS.PROCESSED,
            image: require('../../../assets/icons/order_status/process.png'),
            title: '',
            description: '',

            deliveryManName: '',
            deliveryManId: 0,
        },
        
        orderStatusBar: [1,1,1,1]
    }

    async componentDidMount()
    {
        await this.getOrderDetails()
        await this.getOrderStatus()
    }
 
    getOrderStatus = async() =>
    {
        this.setState({loading: true})
        const res = await API.GET.RetrieveOrderStatus(this.state.referenceNumber)
        
        
        let currentOrder = {...this.state.currentOrder}
        
        if(!res.error)
        {
            if(res.message.data.length > 0)
            {
                const lastStatus = res.message.data[res.message.data.length - 1]
    
                currentOrder.status = lastStatus.Estado
                currentOrder.deliveryManId = lastStatus.Cedula
                currentOrder.deliveryManName = lastStatus.Conductor
    
                if(this.state.orderStatusMessages[lastStatus.Estado])
                {
                    currentOrder = {...currentOrder, ...this.state.orderStatusMessages[lastStatus.Estado]}
                }
            }
        }

        this.setState({loading: false, currentOrder})
    }

    getOrderDetails = async () =>
    {
        const location = JSON.parse(await AsyncStorage.getItem('location'))
        this.setState({loading: true})
        const res = await API.GET.RetrieveOrderDetails(this.state.referenceNumber, location.id)
        
        let products = []
        if(!res.error)
        {
            for (let index = 0; index < res.message.data.length; index++) {
                const product = res.message.data[index];
                products.push(FormatProductForOrderDetail(product))                
            }
        }

        this.setState({loading: false, products})
    }



    getOrderStatusBarColor = (index) =>
    {
        let _color = COLORS._B2C3C3

        if(this.state.currentOrder.status === ORDER_STATUS.PROCESSED && index === 0)
        {
            _color = COLORS._1B42CB
        }
        else if((this.state.currentOrder.status === ORDER_STATUS.ASSIGNED || this.state.currentOrder.status === ORDER_STATUS.REASSIGNED) && index === 1)
        {
            if(this.state.currentOrder.status === ORDER_STATUS.REASSIGNED)
            {
                _color = COLORS._FF2F6C
            }
            else
            {
                _color = COLORS._1B42CB
            }
        }
        else if((this.state.currentOrder.status === ORDER_STATUS.ON_THE_WAY) && index === 2)
        {
            _color = COLORS._1B42CB
        }
        else if((this.state.currentOrder.status === ORDER_STATUS.DELIVERED) && index === 3)
        {
            _color = COLORS._1B42CB
        }

        return _color
    }


    render()
    {
        return(

            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
                

                <HeaderSimple onBack={() => this.props.navigation.goBack()} />

                <View style={{flex:1, backgroundColor:"#f2f2f2"}}>

                    <View style={styles.orderTiltleWrapper}>

                        <View style={styles.orderTitleContainer}>
                            <Text style={styles.orderMainTitleText}>#{this.state.referenceNumber}</Text>
                            <Text style={styles.orderSubTitleText}>{this.state.createDate}</Text>
                        </View> 

                        <Text style={styles.priceText}>{ToCurrencyFormat(this.state.total)}</Text>

                    </View>

                    {this.state.products.length == 0 && !this.state.loading &&
                    <View style={styles.emptyContainer}>
                        <EmptyState mainTitle = 'No se pudo obtener el listado de productos para esta orden.' />
                    </View>
                    }

         
                    <FlatList
                        keyExtractor={(item, index) => `product_${index}`}
                        data={this.state.products}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.productItemContainer}>
                                    <ProductCard 
                                        editable = {false}
                                        image = {item.image}
                                        product = {item} 
                                    />
                                </View>
                            )
                        }}
                    />
                  

                </View>

                {this.state.loading && <FullScreenLoading />}


            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    
    container: { flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },

    productItemContainer: {padding: 15, backgroundColor: COLORS._FFFFFF, borderColor: COLORS._F4F4F4, borderTopWidth: 1.5,},

    orderStatusImageContainer: {width: '100%', paddingVertical: 10, alignItems: 'center',},
    orderStatusImage: {width: '100%', height: 150},
    orderStatusCloseButtonContainer: {position: 'absolute', width: '100%', height: '100%', alignItems: 'flex-end', padding: 15, zIndex: 0},
    orderStatusCloseButton: {width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._FFFFFF, ...GlobalStyles.primaryShadowBox},
    orderStatusBarContainer: {width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
    orderStatusInfoTitleText: {fontSize: 20, color: COLORS._657272, fontFamily: FONTS.BOLD, marginVertical: 15},
    orderStatusInfoDescriptionText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR,},
    orderStatusDeliveryManWrapper: {width: '100%', marginTop: 10},

    priceText: { fontSize: 22, color: "#333", fontFamily: FONTS.BOLD }, 

    orderBackButton: {alignItems: 'flex-start', justifyContent: 'center', width: '10%', paddingVertical: 10, paddingRight: 10, paddingLeft: 5,},
    backButtonImage: {width: 15, height: 15},

    orderTiltleWrapper: {backgroundColor: "#fff", padding: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems:"center"},
    orderTitleContainer: {flex: 1, paddingLeft: 15, justifyContent: 'center'},
    orderMainTitleText: { fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD }, 
    orderSubTitleText: {fontSize: 13, color: "#444", fontFamily: FONTS.REGULAR},

    buttonsContainer: {width: '100%', paddingVertical: 15, alignItems: 'center'},
    purchaseAgainButton: { width: '80%', backgroundColor: COLORS.NO_COLOR, borderWidth: 2, borderColor: COLORS._1B42CB, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, alignItems: 'center', marginBottom: 10, },
    purchaseAgainButtonText: { fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.BOLD },

    emptyContainer: {width: '100%', paddingHorizontal: 15,},

    imageContainer: { width: 56, height: 56, backgroundColor: COLORS.NO_COLOR, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
    image: { width: 65, height: 65, },



})