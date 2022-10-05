import React, {useState, useContext} from 'react';


import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, Modal, StatusBar, SafeAreaView } from 'react-native';

//import BarcodeScanner from './HeaderBarCodeScanner';

import { UtilitiesContext } from '../context/UtilitiesContext';

import Cupones from "../components/Cupones";


const cupon = require("../../assets/icons/cupon.png")
const logo = require('../../assets/la_economia_h.png')
const carticon = require('../../assets/icons/shop_cart/circle_shop_cart.png')
const scan = require('../../assets/icons/bar_scan.png')
const lupa = require('../../assets/icons/search.png')

const Header = ({
    navigation,
    searchFunction
}) => {

    const [searchText, setSearchText] = useState("");
    const [cuponesVisible, setCuponesVisible] = useState(false);
    const [modalBarCodeScannerVisible, setModalBarCodeScannerVisible] = useState(0);
    
    const { location, cart } = useContext(UtilitiesContext)


    goToSearchProduct = () => 
    {
        if(searchFunction) searchFunction(searchText)
        else navigation.navigate('Busqueda', {search: searchText, location: location.id})
        setSearchText("")
    }


    return(
        
        <SafeAreaView style={{backgroundColor: "white", marginTop: -10}}>
            
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <View style={styles.headerContainer}>
                
                <View style={styles.headerMenuBarContainer}>
                    
                    {/* Side menu button */}
                    <View style={styles.headerSlot}>
                        <TouchableOpacity onPress={() => setCuponesVisible(true)} style={{backgroundColor:"white", paddingVertical:8, paddingHorizontal:15, maxWidth:60}}>
                            <Image source={cupon} style={{width:20, height:22}} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerSlot}>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                            <Image source={logo} style={{width: '100%', height: 35}} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerActionButtonWrapper}>

                        <TouchableOpacity style={[{backgroundColor:"white", paddingVertical:8, paddingHorizontal:15, maxWidth:60}]} onPress={() => navigation.navigate("Cart")}>
                            <Image source={carticon} style={styles.headerCartImageButton} resizeMode='contain' />
                            {cart.itemsCount > 0 &&
                            <View style={styles.headerCartBadgeWrapper}>
                                <View style={styles.headerCartBadgeContainer}>
                                    <Text style={styles.headerCartBadgeText}>{cart.itemsCount}</Text>
                                </View>
                            </View>}
                        </TouchableOpacity>
                    </View>

                </View>

        
                <View style={styles.searchBarInputContainer}>
                    <TouchableOpacity onPress={() => {}}>
                        <Image source={scan} style={{width: 16, height:16}} tintColor="#444" resizeMode='contain' />
                    </TouchableOpacity>
                    <TextInput
                        autoCapitalize='none'
                        style={styles.searchBarInput}
                        placeholder='¿Qué estás buscando?'
                        placeholderTextColor="#A5A5A5"
                        onChangeText={async (text) => setSearchText(text)}
                        value={searchText}
                        onSubmitEditing={() => goToSearchProduct(searchText)}
                    />
                    <TouchableOpacity onPress={() => goToSearchProduct()}>
                        <Image source={lupa} style={{width: 18, height: 18}} tintColor="#666" resizeMode='contain'  />
                    </TouchableOpacity>

      
                </View> 

            </View>

            <Cupones visible={cuponesVisible} onclose={() => setCuponesVisible(false)} />

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalBarCodeScannerVisible}
                onRequestClose={() => {}}
            >
                {/*<BarcodeScanner onClose={this.onPressBarCodeScanner.bind(this, false)} onBarCodeScanned={this.onBarCodeScanned.bind(this)} />*/}
            </Modal>

                                

            
        </SafeAreaView>
    )
    

}

export default Header

const styles = StyleSheet.create({


    headerContainer: {backgroundColor: "white", paddingHorizontal: 15, paddingBottom: 7, alignItems: 'center', borderBottomWidth:2, borderBottomColor: "#F2f2f2"},

    headerSlot: {width: '33.3%'},

    headerMenuBarContainer: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },

    headerLocationButton: {width: 23, height: 23, tintColor: "#0A1E63"},
    headerCartImageButton: {width: 23, height: 23, tintColor: "#0A1E63"},

    headerActionButtonWrapper: { width: '33.3%', alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'},

    headerAddressButtonContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    headerAddressText: {fontSize: 16, color: "#0A1E63", marginHorizontal: 5, fontFamily: "Roboto"},

    headerCartButton: {width: 30, height: 30, justifyContent: 'flex-end'},
    headerCartBadgeWrapper: {position: 'absolute', top: 0, right: 0, justifyContent: 'flex-start'},
    headerCartBadgeContainer: {width: 16, height: 16, borderRadius: 8, backgroundColor: "#FF2F6C", alignItems: 'center', justifyContent: 'center'},
    headerCartBadgeText: {fontSize: 10, color: "#FFFFFF", textAlign: 'center', fontFamily: "Roboto"},

    searchBarInputContainer: {width: '100%', alignItems: 'center', borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', height:40, paddingVertical: 3, paddingHorizontal:15, backgroundColor: "#f2f2f2", borderWidth: 0.5, borderColor:"#ccc", marginVertical: 4},
    searchBarInput: {color: "#444", backgroundColor: "rgba(0,0,0,0)", fontSize: 15, fontFamily: "Roboto", flex: 1, paddingLeft:15},
    searchBarButton: {width: '80%', backgroundColor: "rgba(0,0,0,0)"},
    searchBarButtonText: {color: "#A5A5A5", fontSize: 14, fontFamily: "Roboto"},



    loadingIndicatorContainer: {width: '50%',},
    loadingIndicator: {width: '100%', alignItems: 'center'},
})