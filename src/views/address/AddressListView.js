import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, FlatList, Alert, Modal, ActivityIndicator, AsyncStorage, DeviceEventEmitter, Dimensions, BackHandler } from "react-native";
import { SafeAreaView, NavigationEvents } from 'react-navigation';

import { COLORS, REDUCER_SET_ADDRESS, ON_MODIFY_ADDRESS_EVENT, REDUCER_SET_DEFAULT_ADDRESS, ON_CHANGE_DEFAULT_ADDRESS_EVENT, REST, SIGNIN_EVENT, FONTS } from '../../utils/constants';
import { IsIphoneX } from '../../utils/helper';
import { FormatLocationItem, FormatAddress } from '../../utils/formatter';
import { API } from '../../services/service';
import AddressStore from '../../reducers/address.reducer';
import SessionStore from '../../reducers/session.reducer';
import { SignInCard } from '../../components/signin/SignInCard';
import { RegisterForPushNotificationsAsync } from '../../utils/expo_notification/expoPushNotification';
import { HeaderWithTitleAndBackButton } from '../../components/header/HeaderWithTitleAndBackButton';

const {height} = Dimensions.get('screen');

export default class AddressList extends React.Component
{

    static navigationOptions = {
        header: () => null,
    }

    state = {

        loading: true,
        locations: [{name: "Ciudad", id: "0"}],

        addAddressVisible: false,
        deleteAddressVisible: false,
        signInVisible: false,
        signInError: false,

        selectedAddress: -1,

        addresses: []
    }

    async componentDidMount()
    {
        await this.retrieveLocations()

    }

    onNavigationDidFocus = async () => 
    {
        await this.getAddressList()
    }


    getAddressList = async () => 
    {
        let _state = {
            loading: false,
            signInError: false,
            addresses: [],
        }

        let addresses = AddressStore.getState().addresses;

        if(addresses.length > 0)
        {
            _state.addresses = addresses;
        }
        else
        {
            this.setState({loading: true})
    
            const {session} = SessionStore.getState();
            
            const res = await API.POST.PerformRetrieveAddressList(session.document, session.name, session.email, session.token);
    
            if(!res.error)
            {
                for (let index = 0; index < res.message.data.length; index++) {
                    const address = res.message.data[index];
                    _state.addresses.push(FormatAddress(address));
                }

                AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses: _state.addresses})
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
        
        this.setState({..._state})
    }


    retrieveLocations = async () =>
    {   
        this.setState({loading: true})

        const res = await API.GET.RetrieveStores();

        let _state = {
            loading: false,
            locations: [ {name: 'Ciudad', id: "0"}, ]
        }

        if(!res.error)
        {
            for (let i = 0; i < res.message.length; i++) {
                const location = res.message[i];
                _state.locations.push(FormatLocationItem(location));
            }
        }
        else
        {
            Alert.alert('Atención', 'No se pudo obtener el listado de ciudades.', [
                {text: 'Reintentar', onPress: async ()=> await this.retrieveLocations()},
            ])
        }

        this.setState({..._state})
    }


    showDeleteAddressModal = (visible, addressIndex) => 
    {
        this.setState({deleteAddressVisible: visible, selectedAddress: addressIndex})
    }


    goToAddAddress = async () => 
    {
        this.props.navigation.navigate('AddNewAddress');
    }

    onDeleteAddress = async (addressIndex) => 
    {
        let addresses = this.state.addresses;
        addresses.splice(addressIndex, 1);

        // Save in local storage the address changes
        await AsyncStorage.setItem('addresses', JSON.stringify(addresses))

        AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses})

        // If the removed address is equal to default address, we will assign another default address
        if(addressIndex === AddressStore.getState().defaultAddress)
        {
            AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress: 0})
            DeviceEventEmitter.emit(ON_CHANGE_DEFAULT_ADDRESS_EVENT, {defaultAddress: 0, addresses})
        }
        else if(addresses.length === 0)
        {
            AddressStore.dispatch({type: REDUCER_SET_DEFAULT_ADDRESS, defaultAddress: -1})
            DeviceEventEmitter.emit(ON_CHANGE_DEFAULT_ADDRESS_EVENT, {defaultAddress: -1, addresses})
        }

        DeviceEventEmitter.emit(ON_MODIFY_ADDRESS_EVENT, {addresses})

        this.setState({addresses, deleteAddressVisible: false})
    }


    showAddressName = (address) => 
    {
        return address.alias != '' ? address.alias : address.address;   
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
        this.setState({signInVisible: false}, () => this.props.navigation.goBack())
    }

    render()
    {
        return(
            <SafeAreaView style={styles.container} forceInset={{top: IsIphoneX() ? 'always' : 'never'}}>

                <NavigationEvents onDidFocus={this.onNavigationDidFocus.bind(this)} />

                <View style={styles.addressTitleWrapper}>
                    <HeaderWithTitleAndBackButton title='LISTADO' subtitle = 'Mis direcciones' onPress={() => this.props.navigation.goBack()} />
                </View>

                <View style={styles.addressContainer} >

                    <TouchableOpacity style={styles.addNewAddressContainer} onPress={this.goToAddAddress.bind(this)}>
                        <Text style={styles.addNewAddressText}>Agregar nueva dirección</Text>
                    </TouchableOpacity>
                    
                    {this.state.addresses.length == 0 && <Text style={styles.noAddressesText}>Aún no tienes direcciones...</Text>}

                    <FlatList
                        keyExtractor={(item, index) => `address_${index}`}
                        data={this.state.addresses}
                        extraData={this.state}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.addressItemContainer}>

                                    <View style={styles.addressItemNameContainer}>
                                        <Text style={styles.addressItemNameText}>{this.showAddressName(item)}</Text>
                                    </View>

                                    {/* <TouchableOpacity style={styles.addressItemActionButtonContainer}>
                                        <Image resizeMode='contain' style={styles.addressItemActionIcon} source={require('../../../assets/icons/edit.png')} />
                                    </TouchableOpacity> */}

                                    {/* <TouchableOpacity style={styles.addressItemActionButtonContainer} onPress={this.showDeleteAddressModal.bind(this, true, index)}>
                                        <Image resizeMode='contain' style={styles.addressItemActionIcon} source={require('../../../assets/icons/trash.png')} />
                                    </TouchableOpacity> */}

                                </View>
                            )
                        }}
                    /> 
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.deleteAddressVisible}
                    onRequestClose={() => {}}
                >
                    <View style={styles.deleteAddressWrapper}>
                        
                        {this.state.addresses[this.state.selectedAddress] &&
                        <View style={styles.deleteAddressContainer}>

                            <Text style={styles.deleteConfirmationText}>¿Seguro que desea eliminar <Text style={styles.deleteConfirmationAddressNameText}>{`'${this.showAddressName(this.state.addresses[this.state.selectedAddress])}'`}</Text> de su listado?</Text>
                        
                            <TouchableOpacity style={styles.deleteButton} onPress={this.onDeleteAddress.bind(this, this.state.selectedAddress)}>
                                <Text style={styles.deleteButtonText}>Eliminar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={() => this.setState({deleteAddressVisible: false})}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                        </View>}

                    </View>
                </Modal>


                <SignInCard navigation={this.props.navigation} visible = {this.state.signInVisible} onSubmit = {this.onSubmitSignIn.bind(this)} onCancel = {this.onCancelSignIn.bind(this)} error={this.state.signInError} />


                {this.state.loading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={COLORS._0A1E63} />
                </View>}

            </SafeAreaView>

        )
    }
}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._FFFFFF, paddingBottom: height * (IsIphoneX() ? .15 : .25)},

    addressTitleWrapper: { marginTop: IsIphoneX() ? 0 : '6%', width: '100%'},
    
    backButtonContainer: {width: 15, height: 15},

    addressContainer: {paddingHorizontal: 20, width: '100%'},
    addressItemContainer: {paddingVertical: 15, width: '100%', borderBottomWidth: 1, borderColor: COLORS._F4F4F4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' /*<= Remove this when DeleteAddress endpoint available */},
    addressItemNameContainer: {width: '80%', },
    addressItemNameText: {fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    addressItemActionButtonContainer: {width: '10%', alignItems: 'center'},
    addressItemActionIcon: {width: 20, height: 20},

    addNewAddressContainer: {paddingVertical: 15, width: '100%', borderBottomWidth: 1, borderColor: COLORS._F4F4F4, alignItems: 'center'},
    addNewAddressText: {fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR},

    noAddressesText: {fontSize: 16, color: COLORS._657272, marginVertical: 10, fontFamily: FONTS.REGULAR},

    deleteAddressWrapper: {width: '100%', height: '100%', backgroundColor: COLORS.WHITE_80, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20},
    deleteAddressContainer: {paddingHorizontal: 20, paddingVertical: 15, backgroundColor: COLORS._FFFFFF, alignItems: 'center', borderRadius: 15, width: '100%', elevation: 5, shadowColor: COLORS._BABABA, shadowOpacity: 8, shadowRadius: 5, shadowOffset: {height: 5, width: 5}},
    deleteConfirmationText: {fontSize: 20, color: COLORS._657272, textAlign: 'center', marginVertical: 15, fontFamily: FONTS.REGULAR},
    deleteConfirmationAddressNameText: {fontFamily: FONTS.BOLD},
    deleteButton: {width: '80%', borderRadius: 25, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLORS._1B42CB, alignItems: 'center'},
    deleteButtonText: {fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR},
    cancelButton: {width: '80%', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: COLORS.NO_COLOR, alignItems: 'center'},
    cancelButtonText: {fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR},
  
    
    loadingContainer: { position: 'absolute', width: '100%', height: '100%', backgroundColor: COLORS.WHITE_80, alignItems: 'center', justifyContent: 'center'}

})