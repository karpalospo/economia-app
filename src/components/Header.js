import React, {useState, useRef, useContext} from 'react';


import { View, Text, TouchableOpacity, Image, TextInput, Modal, StatusBar, SafeAreaView, Platform } from 'react-native';

import Camara from './HeaderBarCodeScanner';
import { Entypo, Ionicons, Feather  } from '@expo/vector-icons'; 
import { UtilitiesContext } from '../context/UtilitiesContext';
import { styles } from '../global/styles';
import Cupones from "../components/Cupones";

const cupon = require("../../assets/icons/tag.png")
const cart_img = require("../../assets/icons/cart.png")
const logo = require('../../assets/la_economia_h.png')
const icon = require('../../assets/icon.png')

const Header = ({navigation, searchFunction, mode="large"}) => {

    const [text, setText] = useState("");
    const [cuponesVisible, setCuponesVisible] = useState(false);
    const [scannerVisible, setScannerVisible] = useState(false);
    
    const { cart } = useContext(UtilitiesContext)

    const goToSearchProduct = (str) => 
    {
        if(str == undefined) str = text || " "
        setText("")
        if(str.trim() == "") return
        if(searchFunction) searchFunction(str)
        else navigation.navigate('Busqueda', {search: str})
    }

    const Cart = 
        <TouchableOpacity style={_styles.button} onPress={() => navigation.navigate("Cart")}>
            <Image source={cart_img} style={{width:25, height:25}} resizeMode='contain' />
            {cart.itemsCount > 0 &&
            <View style={_styles.badgeWrapper}>
                <View style={_styles.badgeCont}>
                    <Text style={_styles.badgeText}>{cart.itemsCount}</Text>
                </View>
            </View>}
        </TouchableOpacity>

    const Cupon =
        <TouchableOpacity onPress={() => setCuponesVisible(true)} style={_styles.button}>
            <Image source={cupon} style={{width:25, height:25}} resizeMode='contain' />
        </TouchableOpacity>
     
    const BarCode = 
        <TouchableOpacity style={{paddingLeft:15}} onPress={() => setScannerVisible(true)}>
            <Ionicons name="barcode-outline" size={28} color="black" />
        </TouchableOpacity>

    return(
        
        <SafeAreaView style={{backgroundColor: "white", marginTop: Platform == "ios" ? -10 : 0, borderBottomColor:"#ddd", borderBottomWidth: 1}}>
            
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <View style={_styles.container}>
                
                {mode == "large" &&
                    <View style={_styles.menuCont}>
                        {Cupon}
                        <View style={[styles.rowCenter, {flex:1}]}>
                            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                                <Image source={logo} style={{width: 130, height: 40}} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                        {Cart}
                    </View>
                }

                
                <View style={styles.row}>  
                    {mode == "short" && 
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate("Home")}>
                        <Image source={icon} style={{width: 35, height: 35, marginRight: 10}} resizeMode='contain' />
                    </TouchableOpacity>
                    }       
                    <View style={_styles.inputCont}>
                        <TextInput
                            value={text}
                            autoCapitalize='none'
                            style={_styles.input}
                            placeholder={mode == "short" ? "Buscar..." : "Buscar productos, marcas y más..."}
                            placeholderTextColor="#777"
                            onSubmitEditing={() => goToSearchProduct()}
                            onChangeText={text => setText(text)}
                        />
                        <TouchableOpacity onPress={() => goToSearchProduct()}>
                            <Entypo name="magnifying-glass" size={23} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {BarCode}
                    {mode == "short" && Cart}
                </View>  

            </View>

            <Cupones visible={cuponesVisible} onclose={() => setCuponesVisible(false)} />

            <Modal
                animationType="slide"
                transparent={false}
                visible={scannerVisible}
                onRequestClose={() => {}}
            >
                <Camara onClose={() => setScannerVisible(false)} onBarCodeScanned={data => goToSearchProduct(`[ean]${data}`)} />
            </Modal>
            
        </SafeAreaView>
    )
    

}

export default Header

const _styles = {

    button: {
        backgroundColor:"white", 
        paddingVertical:8, 
        paddingHorizontal:15, 
        maxWidth:60
    },

    container: {paddingHorizontal: 15, paddingBottom: 3, alignItems: 'center'},

    menuCont: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },


    badgeWrapper: {position: 'absolute', top: 2, right: 2, justifyContent: 'flex-start'},
    badgeCont: {width: 18, height: 18, borderRadius: 10, backgroundColor: "#FF2F6C", alignItems: 'center', justifyContent: 'center'},
    badgeText: {fontSize: 11, color: "#FFFFFF", textAlign: 'center', fontFamily: "Tommy"},

    inputCont: {
        flex:1, 
        alignItems: 'center', 
        borderRadius: 5, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height:36, 
        paddingVertical: 3, 
        paddingHorizontal:10, 
        paddingLeft:15,
        backgroundColor: "#F2F4F7", 
        marginVertical: 4
    },
    input: {color: "#333", fontSize: 15, fontFamily: "Roboto", flex: 1},


}