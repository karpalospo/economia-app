import React from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Modal, DeviceEventEmitter, AsyncStorage, Alert, Platform, StatusBar } from 'react-native';
import { SafeAreaView, NavigationEvents } from "react-navigation";
import * as Permissions from 'expo-permissions';

import { COLORS, ON_SELECT_LOCATION_EVENT, TOTAL_CHARS_UNTIL_SEARCH, ON_CHANGE_DEFAULT_ADDRESS_EVENT, ON_MODIFY_ADDRESS_EVENT, REDUCER_SET_ADDRESS, REDUCER_SET_DEFAULT_ADDRESS, SIGNIN_EVENT, REST, ON_MODIFY_CART_EVENT, FONTS, SHOW_LOCATION_EVENT } from '../../utils/constants';
import { SEARCH_BY, API } from '../../services/service';
import BarcodeScanner from './HeaderBarCodeScanner';
import LocationStore from '../../reducers/location.reducer';
import AddressStore from '../../reducers/address.reducer';
import ChooseAddress from "../address/ChooseAddress";
import { FormatAddress } from '../../utils/formatter';
import SessionStore from '../../reducers/session.reducer';
import { SignInCard } from '../signin/SignInCard';
import { FullWidthLoading } from '../loading/FullWidthLoading';
import { GetTotalProductsInShopCart } from '../../utils/shopcartHelper';
import { RegisterForPushNotificationsAsync } from '../../utils/expo_notification/expoPushNotification';

export default class Header extends React.Component
{

    state = {
        loading: false,
        searchText: '',

        totalProducts: 0, 

        location: LocationStore.getState().location,
        locationName: LocationStore.getState().locationName,
        defaultAddress: 0,
        addresses: [],

        modalBarCodeScannerVisible: false,
        modalChooseAddressVisible: false,
        addAddressVisible: false,

        signInVisible: false,
        signInError: false,
    }

    UNSAFE_componentWillMount()
    {   
        this.initializeEvents()
    }
    
    UNSAFE_componentWillUnmount()
    {
        this.removeEvents()
    }

    onNavigationFocus = async () => 
    {

        this.initializeEvents()
        await this.getAddressList()
        await this.getTotalProductsInCart()
    }

    initializeEvents = () => 
    {
        if(!this.handleSelectLocation)
        {
            this.handleSelectLocation = DeviceEventEmitter.addListener(ON_SELECT_LOCATION_EVENT, this.onSelectLocation)
        }
        if(!this.handleModifyAddressList)
        {
            this.handleModifyAddressList = DeviceEventEmitter.addListener(ON_MODIFY_ADDRESS_EVENT, this.onModifyAddressList)
        }
        if(!this.handleChangeDefaultAddress)
        {
            this.handleChangeDefaultAddress = DeviceEventEmitter.addListener(ON_CHANGE_DEFAULT_ADDRESS_EVENT, this.onChangeDefaultAddress)
        }
        if(!this.handleModifyCart)
        {
            this.handleModifyCart = DeviceEventEmitter.addListener(ON_MODIFY_CART_EVENT, this.onModifyCart)
        }
    }


    removeEvents = () => 
    {
        if(this.handleSelectLocation)
        {
            this.handleSelectLocation.remove()
        }

        if(this.handleModifyAddressList)
        {
            this.handleModifyAddressList.remove()
        }

        if(this.handleChangeDefaultAddress)
        {
            this.handleChangeDefaultAddress.remove()
        }

        if(this.handleModifyCart)
        {
            this.handleModifyCart.remove()
        }
    }

    getAddressList = async () => 
    {
        this.setState({loading: true})
        let signInVisible = false;
        const {session} = SessionStore.getState();

        if(session.token != "")
        {
            let addresses = AddressStore.getState().addresses;
    
            if(addresses.length == 0)
            {
                const res = await API.POST.PerformRetrieveAddressList(session.document, session.name, session.email, session.token);
    
                if(!res.error)
                {
                    addresses = [];

                    for (let index = 0; index < res.message.data.length; index++) {
                        const address = res.message.data[index];
                        addresses.push(FormatAddress(address));
                    }
    
                    AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses})
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
                        //signInVisible = true
                    }
                }
            }
    
            const defaultAddress = await this.getDefaultAddress();
    
            this.setState({addresses, defaultAddress, signInVisible, loading: false})
        }
        else
        {
            this.setState({loading: false})
        }

    }

    getDefaultAddress = async () => 
    {
        let defaultAddress = AddressStore.getState().defaultAddress;
        
        if(defaultAddress == -1)
        {
            defaultAddress = await AsyncStorage.getItem('defaultAddress')

            if(!defaultAddress)
            {
                defaultAddress = 0;
            }
            else
            {
                AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress})
            }
        }

        return defaultAddress;
    }


     getTotalProductsInCart = async () => 
     {
        this.setState({totalProducts: await GetTotalProductsInShopCart()})
     }


    // ==================================================================
    // Choose address component events
    // ==================================================================
    setDefaultAddress = async (addressIndex) => 
    {
        this.setState({defaultAddress: addressIndex, }, async () =>{
            await AsyncStorage.setItem('defaultAddress', addressIndex.toString())
            AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress: addressIndex})

            this.showChooseAddressModal(false)
        })
    }
    
    
    onPressAddAddress = () => 
    {
        const {session} = SessionStore.getState();

        if(session.token != '')
        {
            this.setState({modalChooseAddressVisible: false}, () => {
                this.props.navigation.navigate('AddNewAddress')
            })
        }
        else
        {
            Alert.alert('Atención', 'Para agregar una dirección es necesario iniciar sesión.', [
                {text: 'Iniciar sesión', onPress: () => {
                    this.setState({modalChooseAddressVisible: false}, () => {
                        this.props.navigation.navigate('SignIn')
                    })
                }},
                {text: 'Volver'}
            ]);
        }
    }
    // ==================================================================
    // ==================================================================
    // Simple SignIn modal 
    // ==================================================================
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
                await this.getAddressList()            
                this.setState({loading: false})
            }
            else
            {
                this.setState({loading: false, signInVisible: true, signInError: true})
            }
        })
    }

    onCancelSignIn = () => 
    {
        this.setState({signInVisible: false}, () => this.props.navigation.goBack())
    }
    // ==================================================================



    onSelectLocation = async (params) => 
    {   
        if(this.state.location != params.selectedLocation.id)
        {
            this.setState({location: params.selectedLocation.id, locationName: params.selectedLocation.name});
        }
    }


    onModifyAddressList = async(params) => 
    {
        this.setState({addresses: params.addresses})
    }


    onChangeDefaultAddress = (params) => 
    {
        let defaultAddress = -1
        if(params.addresses.length > 0)
        {
            defaultAddress = params.defaultAddress;
        }

        this.setState({defaultAddress})
    }

    onModifyCart = (params) => 
    {   
        this.setState({totalProducts: params.quantity})
    }

    showChooseAddressModal = (visible) => 
    {
        this.setState({modalChooseAddressVisible: visible})
    }


    goToSearchProduct = (search, location) => 
    {
        this.setState({searchText: ""})
        if(this.props.searchFunction) this.props.searchFunction(search, location)
        else this.props.navigation.navigate('SearchProduct', {search, location})
    }


    onShowSuggestion = (search, location) =>
    { 
        this.props.onShowSuggestion(search, location);
    }

    onPressShopCart = () => 
    {
        this.props.navigation.navigate('ShopCart', {});
    }
    
    onPressBarCodeScanner = async (visible) =>
    {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        const hasCameraPermission = status === 'granted'

        if(hasCameraPermission)
        {
            this.setState({modalBarCodeScannerVisible: visible});
        }
        else
        {
            Alert.alert('Atención', 'Se necesita el permiso de la cámara para acceder a este menú.')
        }
    }


    onBarCodeScanned = (data) => 
    {
        this.props.navigation.navigate({
            routeName: 'ProductDetail', 
            params: {id: data, searchBy: SEARCH_BY.BAR_CODE, location: this.state.location},
            key: `product_${data}`,
        });
    }


    onPressSideMenu = () =>
    {
        this.props.navigation.toggleDrawer();
    }

    showAddressName = (address) => 
    {
        if(!address)
        {
            return 'Agregar dirección';
        }
        return address.alias != '' ? address.alias : address.address
    }


    onChooseLocation = () =>
    {
        this.setState({modalChooseAddressVisible: false}, () => DeviceEventEmitter.emit(SHOW_LOCATION_EVENT))
        this.props.navigation.closeDrawer()
    }

    render()
    {   
        const {onFocusSearchInput = () => {}, onBlurSearchInput = () => {}} = this.props;

        const h = Platform.OS == "ios" ? StatusBar.currentHeight + 40 : 0

        return(
            
            <SafeAreaView style={{paddingTop: h, backgroundColor: "white"}} forceInset={{top: "never", bottom: "never"}}>
                
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="dark-content"
                />

                <NavigationEvents onWillFocus={this.onNavigationFocus.bind(this)} />

                <View style={styles.headerContainer}>
                    
                    <View style={styles.headerMenuBarContainer}>
                        
                        {/* Side menu button */}
                        <View style={styles.headerSlot}>
                            <TouchableOpacity onPress={this.onPressSideMenu.bind(this)} style={{backgroundColor:"white", paddingVertical:8, paddingHorizontal:15, maxWidth:60}}>
                                <Image source={require('../../../assets/icons/burger_button.png')} style={styles.headerBurgerButton} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>

                        {/* Company logo */}
                        <View style={styles.headerSlot}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")}>
                                <Image source={require('../../../assets/la_economia_h.png')} style={styles.companyLogo} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerActionButtonWrapper}>
                            {this.state.loading &&
                            <View style={styles.loadingIndicatorContainer}>
                                <FullWidthLoading size = "small" style={styles.loadingIndicator} />
                            </View>}

                            {/* Choose address button */}
                            {!this.state.loading && 
                            <TouchableOpacity style={[{backgroundColor:"white", paddingVertical:8, paddingHorizontal:15, maxWidth:60}]} onPress={this.onChooseLocation}>
                                <Image source={require('../../../assets/icons/location_mark.png')} style={styles.headerLocationButton} resizeMode='contain' />
                            </TouchableOpacity>}

                            <TouchableOpacity style={[{backgroundColor:"white", paddingVertical:8, paddingHorizontal:15, maxWidth:60}]} onPress={this.onPressShopCart.bind(this)}>
                                <Image source={require('../../../assets/icons/shop_cart/circle_shop_cart.png')} style={styles.headerCartImageButton} resizeMode='contain' />
                                {this.state.totalProducts > 0 &&
                                <View style={styles.headerCartBadgeWrapper}>
                                    <View style={styles.headerCartBadgeContainer}>
                                        <Text style={[styles.headerCartBadgeText, {fontSize: this.state.totalProducts > 9 ? 8 : styles.headerCartBadgeText.fontSize}]}>{this.state.totalProducts}</Text>
                                    </View>
                                </View>}
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Search bar */}
                    <View style={styles.searchBarInputContainer}>
                        <Image source={require('../../assets/icons/search.png')} style={{width: 18, height: 18}} tintColor="#666" resizeMode='contain'  />

                        {/* Text input search bar */}
                        {!this.props.showSearchBarAsButton &&
                        <TextInput
                            ref = {(ref) => this.searchInputRef = ref}
                            autoCapitalize='none'
                            style={styles.searchBarInput}
                            placeholder='¿Qué estás buscando?'
                            placeholderTextColor={COLORS._A5A5A5}
                            onBlur={onBlurSearchInput}
                            onFocus={onFocusSearchInput}
                            onChangeText={async (text) => this.setState({searchText: text})}
                            value={this.state.searchText}
                            onSubmitEditing={() => this.goToSearchProduct(this.state.searchText, this.state.location)}
                        />}
                        <View/>
                        {/*
                        <TouchableOpacity style={styles.searchBarScanContainer} onPress={this.onPressBarCodeScanner.bind(this, true)}>
                            <Image source={require('../../../assets/icons/bar_scan.png')} style={styles.searchBarScan} resizeMode='contain' />
                        </TouchableOpacity>
                        */}
                    </View> 

                </View>


                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalBarCodeScannerVisible}
                    onRequestClose={() => {}}
                >
                    <BarcodeScanner onClose={this.onPressBarCodeScanner.bind(this, false)} onBarCodeScanned={this.onBarCodeScanned.bind(this)} />
                </Modal>

                <ChooseAddress 
                    visible = {this.state.modalChooseAddressVisible} 
                    data = {this.state.addresses} 
                    selectedAddress = {this.state.defaultAddress} 
                    onChooseAddress = {this.setDefaultAddress.bind(this)} 
                    onClose = {this.showChooseAddressModal.bind(this, false)} 
                    onAddAddress={this.onPressAddAddress.bind(this)} 
                    selectedLocation = {this.state.locationName}
                    onChooseLocation = {this.onChooseLocation.bind(this)}
                />

                <SignInCard 
                    navigation={this.props.navigation} 
                    visible = {this.state.signInVisible} 
                    onSubmit = {this.onSubmitSignIn.bind(this)} 
                    onCancel = {this.onCancelSignIn.bind(this)} 
                    error = {this.state.signInError}
                />
                
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    headerContainer: {paddingHorizontal: 15, backgroundColor: "#ffffff", paddingTop: 5, paddingBottom: 7, alignItems: 'center', borderBottomWidth:2, borderBottomColor: "#F2f2f2"},

    headerSlot: {width: '33.3%'},
    companyLogo: {width: '100%', height: 35,},

    headerMenuBarContainer: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    headerBurgerButton: {width: 18, height: 18,},
    headerLocationButton: {width: 23, height: 23, tintColor: COLORS._0A1E63},
    headerCartImageButton: {width: 23, height: 23, tintColor: COLORS._0A1E63},

    headerActionButtonWrapper: { width: '33.3%', alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'},

    headerAddressButtonContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    headerAddressText: {fontSize: 16, color: COLORS._0A1E63, marginHorizontal: 5, fontFamily: FONTS.REGULAR},

    headerCartButton: {width: 30, height: 30, justifyContent: 'flex-end'},
    headerCartBadgeWrapper: {position: 'absolute', top: 0, right: 0, justifyContent: 'flex-start'},
    headerCartBadgeContainer: {width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS._FF2F6C, alignItems: 'center', justifyContent: 'center'},
    headerCartBadgeText: {fontSize: 10, color: COLORS._FFFFFF, textAlign: 'center', fontFamily: FONTS.REGULAR},

    searchBarInputContainer: {width: '100%', alignItems: 'center', borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal:15, backgroundColor: "#f2f2f2", borderWidth: 0.5, borderColor:"#ccc", marginVertical: 4},
    searchBarInput: {color: "#444", backgroundColor: COLORS.NO_COLOR, fontSize: 15, fontFamily: FONTS.REGULAR, flex: 1, paddingLeft:15},
    searchBarButton: {width: '80%', backgroundColor: COLORS.NO_COLOR},
    searchBarButtonText: {color: COLORS._A5A5A5, fontSize: 14, fontFamily: FONTS.REGULAR},
    searchBarScanContainer: {padding: 1, width: 16, height: 16},
    searchBarScan: {width: '100%', height: '100%'},

    loadingIndicatorContainer: {width: '50%',},
    loadingIndicator: {width: '100%', alignItems: 'center'},
})