import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, BackHandler, FlatList, Alert, DeviceEventEmitter, AsyncStorage, Modal, Platform, StatusBar, AppState } from "react-native";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import _ from "lodash";

import { COLORS, SIGNIN_EVENT, REST, REDUCER_SET_ADDRESS, REDUCER_SET_DEFAULT_ADDRESS, PLATFORM, FONTS, ON_MODIFY_CART_EVENT } from "../../utils/constants";
import { ToCurrencyFormat } from "../../utils/helper";
import SessionStore from "../../reducers/session.reducer";
import { API, BONUS_API } from "../../services/service";
import { SignInCard } from "../../components/signin/SignInCard";
import AddressStore from "../../reducers/address.reducer";
import { FormatAddress, FormatPurchaseProduct, UnformatCoupon, FormatProduct } from "../../utils/formatter";
import { PaymentMethod } from "../../components/shop_cart/PaymentMethod";
import { GetProductsInShopCart, SetProductsInShopCart } from "../../utils/shopcartHelper";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { ProductCard } from "../../components/product/CartHorizontalProductCard";
import { PurchaseCard } from "../../components/shop_cart/PurchaseCard";
import { PruchaseSummary } from "../../components/shop_cart/PurchaseSummary";
import { RegisterForPushNotificationsAsync } from "../../utils/expo_notification/expoPushNotification";
import AutoHeightWebView from 'react-native-autoheight-webview'
import { Dimensions } from 'react-native'

import Toast from "react-native-easy-toast";

const SECTIONS = {
    CART: 0,
    PAYMENT: 1,
    ORDER: 2,
}

const MIN_PURCHASE_AMOUNT_BOGOTA = 30000 
const MIN_PURCHASE_AMOUNT_OTHERS = 15000 

export default class ShopCart extends React.Component {
    state = {

        pedidoexito: true,
        modalpse: false,
        loading: false, 
        signInVisible: false, 
        signInError: false,
        paymentDoneVisible: false,

        sectionHeight: 40,

        homeService: 0,
        orderSubTotal: 0,
        orderTotal: 0,
        orderNetTotal: 0,
        totalByCategories: {},

        currentSection: SECTIONS.CART,

        products: [],

        addresses: [],
        selectedAddress: 0,

        showCouponDiscount: false,
        coupon: {},
        couponDiscount: 0,
        couponValue: '',
        bonusDiscount: 0,
        bonus: {Aplica: false},
        selectedPaymentMethod: '',
        couponApplied: false,
        orderNumber: '',

        informativeBannerVisible: false,

        appState: AppState.currentState,
    }

    async componentDidMount() {

        this.setState({currentSection: SECTIONS.CART})
        await this.getProductsInShopCart()

        this.location = JSON.parse(await AsyncStorage.getItem('location'));
    }


    showError(text) {

        if(!text || text == "") return

        Toast.show(text, {
            position: 0,
            containerStyle:{backgroundColor:'rgba(255,10,10,1)', borderRadius:20, paddingHorizontal:25, paddingVertical:30},
            textStyle: {color: "white"},
        })
    }


    async onNavigationFocus()
    {
        switch (this.state.currentSection) {
            case SECTIONS.PAYMENT:
                await this.getAddressList()
                break;
        }

        if(this.props.navigation.getParam('reload', false))
        {
            this.props.navigation.setParams({reload: false})
            this.setState({currentSection: SECTIONS.CART})
            await this.getProductsInShopCart()
        }
    }

    handleBack = async () => {
        switch (this.state.currentSection) {
            case SECTIONS.CART:
            case SECTIONS.ORDER:
                await SetProductsInShopCart(this.state.products);
                this.props.navigation.goBack();
                break;
            case SECTIONS.PAYMENT:
                const {subtotalAmount, totalAmount} = this.calculateAmounts(this.state.products, this.state.homeService)
                this.setState({ currentSection: this.state.currentSection - 1, couponDiscount: 0, couponValue: '', showCouponDiscount: false, orderSubTotal: subtotalAmount, orderTotal: totalAmount })
                break;
        }
    }


    getProductsInShopCart = async () => 
    {
        this.setState({loading: true})   
        const homeService = await this.getHomeServiceAmount()

        let localProducts = await GetProductsInShopCart(), newProducts, changes = false    
    
        if(localProducts.length > 0) {
            let found = false
            newProducts = await this.getCurrentProductsPrices(localProducts)
            localProducts.forEach(item => {
                found = false
                item._notFound = false
                item._oldPrice = undefined
                newProducts.forEach(item2 => {
                    if(item2.id == item.id) {
                        found = true
                        if(item2.price != item.price) {
                            item._oldPrice = item.price
                            item.price = item2.price
                            changes = true
                        }
                    }
                })
                if(!found) {
                    item._notFound = true
                    changes = true
                }
            })
        }

        
 
        const {totalAmount, subtotalAmount, totalNetAmount, totalByCategories} = this.calculateAmounts(localProducts, homeService);
                
        this.setState({products: localProducts, orderTotal: totalAmount, orderSubTotal: subtotalAmount, orderNetTotal: totalNetAmount, totalByCategories, loading: false})

        return changes
    }


    getCurrentProductsPrices = async (localProducts) =>
    {
        let products = [], location;

        if(!(location = JSON.parse(await AsyncStorage.getItem('location')))) return []
        const res = await API.POST.PerformRetrieveProductsFromCodeList(localProducts.map(item => item.id), location.id)

        if (!res.error && (res.message.data.length > 1)) res.message.data.forEach(item => {if(item.codigo) products.push(FormatProduct(item))})

        return products
    }


    getHomeServiceAmount = async () => 
    {
        let homeService = 0;

        const location = JSON.parse(await AsyncStorage.getItem('location'));

        if(location)
        {
            const res = await API.GET.RetrieveHomeServiceValue(location.id)
            
            if(!res.error)
            {
                homeService = res.message[0].valor_domicilio;
                this.setState({homeService})
            }
            else
            {
                Alert.alert('Atención', 'No se pudo obtener el valor del domicilio.', [
                    {text: 'Reintentar', onPress: async () => await this.getHomeServiceAmount()},
                    {text: 'Volver', onPress: this.props.navigation.goBack()}
                ],
                {cancelable: false})
            }
        }

        return homeService;
    }


    calculateAmounts = (products, homeService = 0, couponDiscount = 0, bonusDiscount = 0) => 
    {   
        let totalNetAmount = 0, totalAmount = 0, subtotalAmount = 0, totalByCategories = this.calculateAmountsByCategory(products)
        
        for (let index = 0; index < products.length; index++) {
            const product = products[index];

            if(product._notFound) continue
            //const discount = (product.minTotalAmount == 0 && product.discount != 0) ? product.price : 0
            totalNetAmount += product.price * product.qty
        }

        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            
            // const discount = totalByCategories[product.category] >= product.minTotalAmount ? Math.round(product.price * product.discount) : 0;
            //const discount = totalNetAmount >= product.minTotalAmount ? product.price : 0;
            if(product._notFound) continue
            subtotalAmount += product.price * product.qty
        }

        totalAmount = ((subtotalAmount + homeService) - couponDiscount) - bonusDiscount;

        return { totalAmount, subtotalAmount, totalNetAmount, totalByCategories}
    }

    calculateAmountsByCategory = (products) =>
    {
        let totalByCategories = {}

        for (let index = 0; index < products.length; index++) {
            const product = products[index];

            if(!totalByCategories[product.category])
            {
                totalByCategories[product.category] = (product.price * product.qty)
            }
            else
            {
                totalByCategories[product.category] += (product.price * product.qty) 
            }
        }
        
        return totalByCategories
    }

    getAddressList = async () => 
    {
        let _state = {
            loading: false,
            signInError: false,
            addresses: [],
        }

        const {addresses} = AddressStore.getState();

        if(addresses.length > 0)
        {
            _state.addresses = addresses;
            _state.selectedAddress = AddressStore.getState().defaultAddress != -1 ? AddressStore.getState().defaultAddress : 0;
        }
        else
        {
            this.setState({loading: true})
    
            const {session} = SessionStore.getState();
            
            if(session.token != '')
            {
                const res = await API.POST.PerformRetrieveAddressList(session.document, session.name, session.email, session.token);
        
                if(!res.error)
                {
                    for (let index = 0; index < res.message.data.length; index++) {
                        const address = res.message.data[index];
                        _state.addresses.push(FormatAddress(address));
                    }
    
                    AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses: _state.addresses})
                    _state.selectedAddress = AddressStore.getState().defaultAddress != -1 ? AddressStore.getState().defaultAddress : 0;
                }
                else
                {
                    if(res.message == REST.TOKEN.ERROR)
                    {
                        const credentials = JSON.parse(await AsyncStorage.getItem('credentials'))
                        if(credentials)
                        {
                            const signInError = await this.signIn(credentials.email, credentials.password)
                            if(!signInError)
                            {
                                await this.getAddressList()
                                return
                            }
                        }
                        // Show SignIn modal
                        _state.signInVisible = true
                    }
                    else
                    {
                        Alert.alert('Atención', 'No se pudo obtener el listado de tus direcciones.', 
                        [
                            {text: 'Reintentar', onPress: async () => await this.getAddressList()},
                            {text: 'Volver', onPress: () => this.props.navigation.goBack()}
                        ],
                        {cancelable: false});
                    }
                }
            }
            else
            {
                _state.signInVisible = true 
            }

        }
        
        this.setState({..._state})
    }


    onModifyProductQuantity = (productQty, productIndex, productId) => 
    {   
        let products = this.state.products;
        if(productQty == 0)
        {
           products.splice(productIndex, 1);    
        }
        else
        {
            if(products[productIndex].stock >= productQty)
            {
                products[productIndex].qty = productQty;
            }
            else
            {
                Alert.alert('Atención', 'La cantidad solicitada no está disponible.');
                products[productIndex].qty = products[productIndex].stock;
            }
        }

        const {totalAmount, subtotalAmount, totalNetAmount, totalByCategories} = this.calculateAmounts(products, this.state.homeService);

        this.setState({products, orderTotal: totalAmount, orderSubTotal: subtotalAmount, orderNetTotal: totalNetAmount, totalByCategories}, async () => {
            // On delete the last product, return to home screen
            if(this.state.products.length === 0)
            {
                await SetProductsInShopCart(this.state.products);
            }
        })

    }

    onGoBackPressed = () => {
        this.handleBack()
    }

    onNextButtonPressed = async () => {
 
        if (this.state.currentSection < SECTIONS.ORDER) {
            
            let shouldChangeSection = true;

            switch (this.state.currentSection) {

                case SECTIONS.CART:
                    await AsyncStorage.setItem("disclaimer_c", "2")
                    const disclaimer_c = await AsyncStorage.getItem("disclaimer_c")
                    if(disclaimer_c)
                    {
                        const parsedDisclaimer_C = parseInt(disclaimer_c)
                        if(parsedDisclaimer_C === NaN || parsedDisclaimer_C === 1)
                        {
                            this.setState({currentSection: this.state.currentSection + 1})
                            this.onNextButtonPressed()
                            //this.setState({informativeBannerVisible: true})
                            return
                        }
                        
                    }
                    else
                    {
                        this.setState({currentSection: this.state.currentSection + 1})
                        this.onNextButtonPressed()
                        //this.setState({informativeBannerVisible: true})
                        return
                    }
                    
                    const location = JSON.parse(await AsyncStorage.getItem('location'));
                    
                    if(location.id == "11001" && this.state.orderSubTotal < MIN_PURCHASE_AMOUNT_BOGOTA)
                    {
                        Alert.alert('Atención', `El monto total de la compra no debe ser inferior a ${ToCurrencyFormat(MIN_PURCHASE_AMOUNT_BOGOTA)}.`)
                        shouldChangeSection = false
                    }
                    else if(this.state.orderSubTotal < MIN_PURCHASE_AMOUNT_OTHERS)
                    {
                        Alert.alert('Atención', `El monto total de la compra no debe ser inferior a ${ToCurrencyFormat(MIN_PURCHASE_AMOUNT_OTHERS)}.`)
                        shouldChangeSection = false
                    }
                    else if(this.state.products.length == 0)
                    {
                        Alert.alert('Atención', 'No tienes productos en el carrito.')
                        shouldChangeSection = false
                    }
                    
                    await SetProductsInShopCart(this.state.products);

                    break;
                
                    
                case SECTIONS.PAYMENT:
                    this.checkoutOrder()
                    break;
                    

            }

            if(shouldChangeSection)
            {
                this.setState({ currentSection: this.state.currentSection + 1 }, async () => 
                {   
                    if(this.state.currentSection == SECTIONS.PAYMENT) {
                        this.getAddressList()
                    }
    
                })
            }
        }
    }


    onSelectAddress = (addressIndex) => 
    {   

        this.setState({selectedAddress: addressIndex, }, async () =>{
            await AsyncStorage.setItem('defaultAddress', addressIndex.toString())
            AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress: addressIndex})
        })
    }

    goToAddAddress = () => 
    {
        const {session} = SessionStore.getState();

        if(session.token != '')
        {
            this.props.navigation.navigate('AddNewAddressFromCart');
        }
        else
        {
            Alert.alert('Atención', 'Aún no has iniciado sesión.', [
                {text: 'Iniciar sesión', onPress: () => { this.setState({signInVisible: true}) }},
                {text: 'Volver', onPress: () => { this.setState({currentSection: SECTIONS.CART}) }},
            ],
            {cancelable: false})
        }
    }


    checkoutOrder = async () => 
    {

        const location = JSON.parse(await AsyncStorage.getItem('location'));

        const {session} = SessionStore.getState();

        let {selectedPaymentMethod, addresses, selectedAddress, homeService, coupon, bonus, couponApplied} = this.state
        let discount = 0;

        /*console.log(coupon, couponApplied)
        if(Object.keys(coupon).length > 0 && !couponApplied) {
            Alert.alert('Atención', "Tiene un cupón sin aplicar, presione el botón 'APLICAR'.")
            return
        }*/

        if(session.token != '')
        {
            this.setState({loading: true})

            // Format products
            let productsForAPI = []
            for (let index = 0; index < this.state.products.length; index++) {
                let product = {...this.state.products[index]}
                if(product._notFound) return;
                discount = this.state.orderNetTotal >= product.minTotalAmount ? product.price : 0;
  
                productsForAPI.push(FormatPurchaseProduct(product))

            }

            productsForAPI.push(
                {
                    codigo: "999992", 
                    descripcion: "domicilio", 
                    price: this.state.homeService,
                    stock:1,
                    idoferta:0,
                    cantidad: 1,
                    descuento:0,
                    IdUnidad:1
                }
            )

            const total = this.state.orderSubTotal - this.state.couponDiscount + this.state.homeService
   
            const res = await API.POST.checkout(
                {a:selectedPaymentMethod, b:selectedPaymentMethod == "PSE" ? "OnLine" : "ContraEntrega", c:addresses[selectedAddress].address, d:location.id, e:0, f:location.id, g:location.name, h:total, s:homeService, v:discount, i: "APP" + Platform.OS, obs: "soy observacion" },
                {j:bonus}, 
                {k: {nit: session.document, nombres: session.name, email: session.email, auth_token: session.token}},
                {l: UnformatCoupon(coupon)},
                {m:productsForAPI}
            )

            //console.log(res)
            
            if(!res.error)
            {
                if(res.message.codeError) {
                    Alert.alert('Atención', res.message.message)
                } else {
                    if(this.state.selectedPaymentMethod == "PSE") {
                    
                        let d = {
                            nombre: session.name.split(" ")[0],
                            apellido: session.name.split(" ")[1] || "",
                            celular: "",
                            telefono: "",
                            email: session.email,
                            ciudad: res.message.city,
                            direccion: addresses[selectedAddress].address,
                            cedula: session.document,
                            total,
                            numero_orden: res.message.order
                        }

                        this.setState({
                            currentpedido: res.message.order, 
                            modalpse: true,
                            psebody: encodeURI(`Acid=83791&Accountpassword=1234&FNm=${d.nombre}&LNm=${d.apellido}&Mob=${d.celular}&Pho=${d.telefono}&Ema=${d.email}&CI=${d.ciudad}&Add=${d.direccion}&IdNumber=${d.cedula}&IdType=CC&MOpt1=001&Total=${d.total}&Tax=0&BDev=0&Ref1=${d.numero_orden}&Desc=0&MOpt3=https://www.droguerialaeconomia.com/economia/pagos/Online&ReturnURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&CancelURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&EnablePSE=true&EnableCard=false&EnableCash=false&EnableEfecty=false&Version=2`)
                        })

                    } else {
                        this.setState({currentpedido: res.message.order.toString()})
                        this.finishCompra()
                    }
                }
                
            } else {
                Alert.alert('Atención', 'No se pudo procesar la compra, por favor vuelve a intentarlo.', [
                    {text: 'Reintentar', onPress: async () => await this.checkoutOrder()},
                    {text: 'Cancelar',}
                ])
            }
        
            let _state = {
                loading: false,
            }
                
            this.setState({..._state})
        }
        else
        {
            Alert.alert('Atención', 'Aún no has iniciado sesión.', [
                {text: 'Iniciar sesión', onPress: () => { this.setState({signInVisible: true}) }},
                {text: 'Volver', onPress: () => { this.setState({currentSection: SECTIONS.CART}) }},
            ],
            {cancelable: false})
        }

    }


    onSelectPaymentMethod = (selectedPaymentMethod) => 
    {   
        this.setState({selectedPaymentMethod})
    }

    onApplyBonus = (bonus) =>
    {
        let state = {
            bonus: {Aplica: false},
            loading: false,
        }

        if(bonus.isValid)
        {
            const {subtotalAmount, totalAmount} = this.calculateAmounts(this.state.products, this.state.homeService, this.state.couponDiscount, bonus.discount)
            state.bonus = bonus.bonus
            state.orderSubTotal = subtotalAmount
            state.orderTotal = totalAmount
            state.bonusDiscount = bonus.discount
        }
        
        this.setState({...state})
    }

    onApplyCoupon = (error, coupon) =>
    {
        this.setState({couponDiscount: !error ? coupon.value : 0, couponValue: !error ? coupon.name : '', coupon}, () => {
            const {totalAmount, totalNetAmount, totalByCategories} = this.calculateAmounts(this.state.products, this.state.homeService, this.state.couponDiscount, this.state.bonusDiscount)
            this.setState({orderTotal: totalAmount, orderNetTotal: totalNetAmount, totalByCategories, couponApplied: true,})
        })
    }

    signIn = async (email, password) => {

        const res = await API.POST.PerformSignIn(email, password);
        
        if(!res.error)
        {
            DeviceEventEmitter.emit(SIGNIN_EVENT, {credentials: {email, password}, session:{token: res.message.data.auth_token, email: res.message.data.email, name: res.message.data.nombres, document: res.message.data.nit}})
            await RegisterForPushNotificationsAsync(res.message.data.email)
        }

        return res.error
    }


    onSubmitSignIn = (email, password) => 
    {
        this.setState({signInVisible: false},
        async () => {
            this.setState({loading: true})
            const error = await this.signIn(email, password)
            
            if(!error)
            {   
                this.setState({loading: false})
                await this.getAddressList()
            }
            else
            {
                this.setState({loading: false, signInVisible: true, signInError: true})
            }
        })
    }

    onCancelSignIn = () => 
    {
        this.setState({signInVisible: false}, () => this.setState({currentSection: SECTIONS.CART}))
    }

    finishCompra = async () => {

        let _state = {loading: false}

        const pedido = await API.POST.getPedido(this.state.currentpedido)


        if(!pedido.error) _state.pedidoexito = pedido.message.data[0].Estado

        
        _state.paymentDoneVisible = true;
        _state.orderNumber = this.state.currentpedido;

        // Clear the shop cart
        SetProductsInShopCart([]);
        DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: 0})

        this.setState({..._state})


    }


    reCalculateCart = async () => {
        this.location = JSON.parse(await AsyncStorage.getItem('location'));
        console.log(">", this.location)
        let changes = await this.getProductsInShopCart()
        if(changes) {
            Alert.alert("Carrito de Compras", "Algunos productos de tu carrito han cambiado.")
            this.handleBack()
        }
    }

    render () {

        return (
            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>

                <NavigationEvents onDidFocus={this.onNavigationFocus.bind(this)} />

                {/* Cart detail section */}
                {(this.state.currentSection == SECTIONS.CART && this.state.loading) && <FullWidthLoading />}

                {(this.state.currentSection == SECTIONS.CART && !this.state.loading) &&
                <View style={styles.sectionWrapper}>

                    {this.state.products.length == 0 &&
                    <View style={styles.emptyCartContainer}>
                        <Text style={styles.emptyCartText}>Aún no tienes productos en tu carrito...</Text>
                    </View>}                   

                    <FlatList 
                        keyExtractor={(item, index) => `product_${index}`}
                        data={this.state.products}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.productItemContainer}>
                                    <ProductCard 
                                        totalNetAmount={this.state.orderNetTotal} 
                                        product={item} 
                                        image={item.image} 
                                        onAddProductToCart={(qty) => this.onModifyProductQuantity(qty, index, item.id)}
                                    />
                                </View>
                            )
                        }}
                    />

                    <View style={styles.purchaseDetailContainer}>

                        {/* Home service */}
                        <View style={{width:"45%", paddingLeft: 10, marginHorizontal:"2.5%", flexDirection:"row", alignItems: "center"}}>
                            <Text>Domicilio:</Text>
                            <Text style={styles.purchaseDetailItemText}>{ToCurrencyFormat(this.state.homeService)}</Text>
                        </View>

                        {/* Subtotal */}
                        <View style={{width:"45%", marginHorizontal:"2.5%", flexDirection:"row", alignItems: "center"}}>
                            <Text>Total Carrito:</Text>
                            <Text style={[styles.purchaseDetailItemText, {color: COLORS._1B42CB}]}>{ToCurrencyFormat(this.state.orderSubTotal)}</Text>
                        </View>
                    </View>

                </View>}


                {/* Payment method section */}
                {this.state.currentSection == SECTIONS.PAYMENT &&
                <View style={styles.sectionWrapper}>


                    <PaymentMethod
                        reCalculateCart={this.reCalculateCart}
                        location={this.location} 
                        loading = {this.state.loading} 
                        addresses = {this.state.addresses} 
                        selectedAddress = {this.state.selectedAddress} 
                        onSelectAddress = {this.onSelectAddress.bind(this)} 
                        onPressAddNewAddress = {this.goToAddAddress.bind(this)}

                        loadingOrder={this.state.loading} 
                        orderSubtotal = {this.state.orderSubTotal} 
                        homeService = {this.state.homeService} 
                        orderTotal = {this.state.orderTotal} 
                        couponDiscount = {this.state.couponDiscount} 
                        products = {this.state.products} 
                        onApplyCoupon = {this.onApplyCoupon.bind(this)} 
                        onSelectPaymentMethod={this.onSelectPaymentMethod.bind(this)} 
                        onApplyBonus={this.onApplyBonus.bind(this)} 
                    />




                </View>}

                {/* Purchase summary */}
                {this.state.currentSection == SECTIONS.ORDER &&
                <View style={styles.sectionWrapper}>
                    <PruchaseSummary 
                        loading = {this.state.loading}
                        orderNumber = {this.state.orderNumber}
                        orderTotal = {this.state.orderTotal}
                        orderSubtotal = {this.state.orderSubTotal}
                        homeService = {this.state.homeService}
                        couponDiscount = {this.state.couponDiscount}
                        bonusDiscount = {this.state.bonusDiscount}
                        paymentMethod = {this.state.selectedPaymentMethod}
                        products = {this.state.products}
                        onDismiss = {() => this.props.navigation.navigate('Home')}
                    />
                </View>}

                {/* SignIn */}
                <SignInCard navigation={this.props.navigation} visible = {this.state.signInVisible} onSubmit = {this.onSubmitSignIn.bind(this)} onCancel = {this.onCancelSignIn.bind(this)} error = {this.state.signInError} />

                {/* Footer */}
                {this.state.currentSection != SECTIONS.ORDER &&
                <View style={styles.footerContainer}>

                    <TouchableOpacity style={styles.footerBackButton}
                        onPress={this.onGoBackPressed.bind(this)}
                        disabled={this.state.loading}
                    >
                        <Image source={require('../../../assets/icons/dropleft_arrow.png')} style={[styles.footerBackButtonImage, { tintColor: COLORS._1B42CB}]} resizeMode='contain' />
                        <Text style={styles.footerBackButtonText}>REGRESAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.footerAddToCartButton}
                        onPress={this.onNextButtonPressed.bind(this)}
                        disabled={this.state.loading}
                    >
                        <Text style={[styles.footerAddToCartButtonText, {color: COLORS._FFFFFF}]}>{`${this.state.currentSection == SECTIONS.PAYMENT ? 'CONFIRMAR PEDIDO' : 'COMPRAR AHORA'}`}</Text>
                    </TouchableOpacity>

                </View>}

                {/* Payment done modal */}
                <Modal
                    animationType = 'fade'
                    transparent = {true}
                    visible = {this.state.paymentDoneVisible}
                    onRequestClose = {() => {}}
                >
                    <PurchaseCard onPress={() => this.setState({paymentDoneVisible: false})} exito={this.state.pedidoexito} />
                </Modal>
                <Modal
                    animationType = 'fade'
                    transparent = {true}
                    visible = {this.state.modalpse}
                    onRequestClose = {() => {}}
                >
                    <View style={{height:50, backgroundColor: "white"}}></View>
                    <AutoHeightWebView
                        style={{ width: Dimensions.get('window').width}}
                        source={{uri:'https://ecommerce.pagosinteligentes.com/checkout/Gateway.aspx', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, method: 'POST', body: this.state.psebody }}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=no'}
                        onLoadProgress={({ nativeEvent }) => {
                            if(nativeEvent.progress == 1) {
                                if(nativeEvent.url == "https://www.droguerialaeconomia.com/") {
                                    this.setState({modalpse: false})
                                    this.finishCompra()
                                }
      
                            }
                        }}
                    />
                
                </Modal>

            </SafeAreaView>
        )
    }


}


const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },

    purchaseDetailContainer: { paddingVertical: 15, backgroundColor: COLORS._FFFFFF, alignItems: 'center', flexDirection: "row", justifyContent: "space-between" },
    purchaseDetailItemContainer: { width: '100%', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
    purchaseDetailItemText: { fontSize: 19, color: "#333", fontFamily: FONTS.BOLD , paddingLeft: 7},
    purchaseDetailItemTotalText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD},

    sectionWrapper: {flex: 1, paddingBottom: 60},

    cartSectionWrapper: { opacity: 0, height: 0, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor:"#f2f2f2" },
    sectionContainer: { width: '25%', alignItems: 'center', },
    imageSectionWrapper: { width: '100%', flexDirection: 'row', alignItems: 'center' },
    imageSeparator: { width: '25%', height: 1, },
    imageSectionContainer: { width: '50%', borderWidth: 1, borderColor: COLORS._FF2F6C, alignItems: 'center', justifyContent: 'center', },
    imageSection: { width: 20, height: 20, tintColor: COLORS._FF2F6C, },
    sectionText: { fontSize: 15, color: COLORS._FF2F6C, marginVertical: 10, fontFamily: FONTS.REGULAR },
    emptyCartContainer: {width: '100%', padding: 15},
    emptyCartText: {fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},

    productItemContainer: {padding: 15, backgroundColor: COLORS._FFFFFF, borderColor: COLORS._F4F4F4, borderTopWidth: 1.5,},

    footerContainer: { position: 'absolute', width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS._F4F4F4, paddingVertical: 10, bottom: 0 },
    footerBackButton: { width: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 2, borderColor: COLORS._1B42CB, borderRadius: 6, marginHorizontal: "2.5%" },
    footerBackButtonImage: { width: 10, height: 10, tintColor: COLORS._A5A5A5 },
    footerBackButtonText: { fontSize: 15, color: COLORS._1B42CB, marginLeft: 10, fontFamily: FONTS.REGULAR},
    footerAddToCartButton: { width: '45%', alignItems: 'center', padding: 15, backgroundColor: COLORS._1B42CB, borderRadius: 6,  marginHorizontal: "2.5%" },
    footerAddToCartButtonText: { fontSize: 15, color: COLORS._FF2F6C, fontFamily: FONTS.REGULAR },
})