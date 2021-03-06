import React from 'react';
import { View, Modal, DeviceEventEmitter, AsyncStorage, Alert, Platform, StatusBar, Text, StyleSheet } from 'react-native';
import { Notifications, } from 'expo';

import { createSwitchNavigator, createAppContainer, } from "react-navigation";
import { SHOW_LOCATION_EVENT, ON_SELECT_LOCATION_EVENT, REDUCER_SAVE_LOCATION, SET_CATEGORIES_EVENT, REDUCER_RESET_SESSION, SIGNIN_EVENT, SIGNOUT_EVENT, REDUCER_SET_SESSION, REDUCER_SET_ADDRESS, ON_MODIFY_CART_EVENT, FONTS, COLORS } from './utils/constants';
import Entry from './views/entry/Entry';
import LocationSelector from './components/location/LocationSelector';
import LocationStore from './reducers/location.reducer';
import SessionStore from './reducers/session.reducer';
import InAppStack from './routes/InAppRoutes';
import AddressStore from './reducers/address.reducer';
import { CapitalizeWord } from './utils/helper';
import { SetProductsInShopCart } from './utils/shopcartHelper';
import Toast from "react-native-easy-toast";



const AppNavigator = createSwitchNavigator({
    Entry,
    Home: InAppStack,
}, {
    initialRouteName: 'Entry',
})

let _toast = {}

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component
{

  state = 
  { 
    location: 'Cambiar ciudad',

    chooseLocationModalVisible: false,

    categoryGroups: [],
    session: SessionStore.getState().session,

    loadingCategories: true,
  }

  constructor(props)
  {
    super(props)

    this.initializeEvents()
  }

  async componentDidMount()
  {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle(Platform.OS === 'ios' ? 'dark-content' : 'default');

    await this.initializeReducers()

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  UNSAFE_componentWillUnmount()
  {
    this.handleChooseLocationModal.remove()
    this.handleGetCategories.remove()
    this.handleSignIn.remove()
    this.handleSignOut.remove()
    this.handleModifyCart.remove()
  }

  initializeEvents = () => 
  {
    this.handleChooseLocationModal  = DeviceEventEmitter.addListener(SHOW_LOCATION_EVENT, this.handleLocationEvent)
    this.handleGetCategories        = DeviceEventEmitter.addListener(SET_CATEGORIES_EVENT, this.handleGetCategoriesEvent)
    this.handleSignIn               = DeviceEventEmitter.addListener(SIGNIN_EVENT, this.handleSignInEvent)
    this.handleSignOut              = DeviceEventEmitter.addListener(SIGNOUT_EVENT, this.handleSignOutEvent)
    this.handleModifyCart           = DeviceEventEmitter.addListener(ON_MODIFY_CART_EVENT, this.onModifyCart)
  }


  initializeReducers = async () => 
  {
    const multiGet = await AsyncStorage.multiGet(['location', 'auth']);

    let keys = {
      location: null,
      auth: null,
    }

    for (let index = 0; index < multiGet.length; index++) {
      const key = multiGet[index][0];
      const value = multiGet[index][1];
      
      if(value)
      {
        keys[key] = JSON.parse(value);
      }
    }

    if(keys.location)
    {
      this.setState({location: CapitalizeWord(keys.location.name)})
      LocationStore.dispatch({type: REDUCER_SAVE_LOCATION, location: keys.location.id, locationName: CapitalizeWord(keys.location.name)})
    }
    
    if(keys.auth)
    { 
      SessionStore.dispatch({type: REDUCER_SET_SESSION, session: {...keys.auth}})
      this.setState({session: {...keys.auth}})
    }

  }

  _handleNotification = (notification) => {
    
    if(Platform.OS === 'ios')
    {
      Alert.alert('Notificaciones', notification.data.message)
    }
  }

  handleLocationEvent = () => 
  {
    this.setState({chooseLocationModalVisible: true})
  }

  onModifyCart = (params) => 
  {
    if(params.quantity > 0)
    {
      this.toast.show(
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Producto agregado al carrito</Text>
        </View>, 
        1200
      )
    }
  }


  handleGetCategoriesEvent = (params) => 
  {
    if(params.categoryGroups && this.state.categoryGroups.length === 0)
    {
      this.setState({categoryGroups: params.categoryGroups, loadingCategories: false})
    }
  }

  handleSignInEvent = async (params) => 
  {
    SessionStore.dispatch({type: REDUCER_SET_SESSION, session: {...params.session}})
    this.setState({session: {...params.session}})
    await AsyncStorage.multiSet([['auth', JSON.stringify({...params.session})], ['credentials', JSON.stringify({...params.credentials})]]);
  }
  
  handleSignOutEvent = async () => 
  {
    SessionStore.dispatch({type: REDUCER_RESET_SESSION})
    AddressStore.dispatch({type: REDUCER_SET_ADDRESS, addresses: []})
    this.setState({session: {email: "", name: "", token: "", document: ""}})
    await AsyncStorage.multiRemove(['auth', 'defaultAddress', 'deviceId', 'credentials', 'vida_sana'])
  }

  onSelectLocation(selectedLocation)
  {
    
    this.setState({chooseLocationModalVisible: false}, async () => 
    { 
      if(selectedLocation.id != LocationStore.getState().location) 
      {  
        this.setState({location: CapitalizeWord(selectedLocation.name)})

        LocationStore.dispatch({type: REDUCER_SAVE_LOCATION, location: selectedLocation.id, locationName: CapitalizeWord(selectedLocation.name)})

        // Store locally the selected location
        await AsyncStorage.setItem('location', JSON.stringify(selectedLocation))
  
        // Empty the shop cart
        SetProductsInShopCart([])
        DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: 0})

        DeviceEventEmitter.emit(ON_SELECT_LOCATION_EVENT, {selectedLocation})
      }
    })
  }


  groupCategoriesVisible = (groupId) =>
  {
    if(typeof(this.state[`visible_${groupId}`]) == 'boolean')
    {
      this.setState({[`visible_${groupId}`]: !this.state[`visible_${groupId}`]})
    }
    else
    {
      this.setState({[`visible_${groupId}`]: true})
    }
  }

  categorySubCategoriesVisible = (categoryId) =>
  { 
    if(typeof(this.state[`visible_${categoryId}`]) == 'boolean')
    {
      this.setState({[`visible_${categoryId}`]: !this.state[`visible_${categoryId}`]})
    }
    else
    {
      this.setState({[`visible_${categoryId}`]: true})
    }
  }

  render()
  {
    return(

      <View style={{ flex: 1}}>
        
        <AppContainer screenProps={{...this.state, groupCategoriesVisible: (groupId) => this.groupCategoriesVisible(groupId), categorySubCategoriesVisible: (categoryId) => this.categorySubCategoriesVisible(categoryId)}} />

        {/* Choose location */}
        <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.chooseLocationModalVisible}
            onRequestClose={() => {}}
        >
            <LocationSelector onSelectLocation = {(selectedLocation) => this.onSelectLocation(selectedLocation) } onCancel={() => this.setState({chooseLocationModalVisible: false})} />
        </Modal>

        <Toast 
          ref={(toast) => this.toast = toast}
          positionValue={100}
          style={styles.toastWrapper}
          fadeInDuration={1000}
          fadeOutDuration={1000}
        />
      </View>

    )
  }

}


const styles = StyleSheet.create({
  toastWrapper: {width: '100%', padding: 15, paddingBottom: 50, borderRadius: 15, backgroundColor: COLORS._FFFFFF, alignItems: 'center', justifyContent: 'flex-start', elevation: 5, shadowColor: COLORS._BABABA, shadowOffset: {width: 0, heigth: 2}, shadowOpacity: 7, shadowRadius: 15,},
  toastContainer: {width: '90%', borderRadius: 25, backgroundColor: COLORS._0A1E63, paddingVertical: 15, alignItems: 'center' },
  toastText: { fontSize: 15, fontFamily: FONTS.BOLD, color: COLORS._FFFFFF},
})