import React from "react";
import { View, Text, TouchableOpacity, Image, Platform} from "react-native";
import Cantidad from "./Cantidad";
import { f, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from '../global/functions';
import Button from "../components/Button";


const oferta = require("../../assets/icons/oferta2.png")

const Product = ({mykey, item, itemCart, onTap, onChange, addCart}) => {

    let hasDiscount = item.discount > 0 && !IsExcludedCategory(item.subgrupo36)

    return (
        <View key={mykey} style={styles.container}>
                            
            <TouchableOpacity activeOpacity={0.85} style={styles.imageCont} onPress={onTap}>
                <Image source={item.image} style={styles.mainImage} resizeMode='contain' onError={(error) => {}} />
                {hasDiscount &&
                    <View style={styles.descCont}>
                        <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                        <Text style={styles.descuento}>{`${item.discount}%`}</Text>
                    </View>
                }
            
                <View style={styles.detalle}>
                    <Text style={styles.nombre}>{CapitalizeWord(item.name)}</Text>
                    <View style={styles.precioCont}>
                        {hasDiscount && <Text style={styles.precioAntes}>{f(item.antes)}</Text>}
                        <Text style={[styles.precio, hasDiscount ? {color: "#FF2F6C"} : {}]}>{f(item.price)}</Text>
                    </View>
                    <Text style={styles.unidad}>{CapitalizeWords(item.unit)}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.agregarCont}>
                {itemCart && itemCart._quanty > 0 && <Cantidad value={itemCart._quanty} item={item} onChange={onChange} />}
                {!itemCart && <Button title="AGREGAR" onPress={() => addCart(item)} /> }
            </View>

        </View>
    )
}

export default Product

const styles = {

    container: {
        flex:0.5, 
        margin: 1,
        paddingTop:10,
        paddingBottom:18,
        backgroundColor: "#FFFFFF",
        borderRadius: 4
    },

    imageCont: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    detalle: {paddingHorizontal: 10, width: '100%'},
    precioCont: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30},
    precio: {fontSize: 20, color: "#333", fontFamily: "Tommy"},
    precioAntes: {fontSize: 14, textDecorationLine: 'line-through', color: "#aaa", fontFamily: "Tommy", paddingRight:14},

    nombre: {fontSize: 15, color: "#444", marginVertical: 8, fontFamily: "TommyR", textAlign:"center", minHeight:60},
    unidad: {fontSize: 12, color: "#666", fontFamily: "TommyR", textAlign:"center", height:20, marginTop:5, lineHeight:20},

    agregarCont: {
        width: '100%', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical:5, 
        marginTop:10
    },

    descCont: { position: 'absolute', top: 0, left: 10, width: 38, width: 38, justifyContent: 'center'},
    discountImg: {width:38, height: 38, position:"absolute", zIndex:-1, top:3, right:3},
    descuento: {
        fontSize: 15, 
        color:"white", 
        fontFamily: "RobotoB", 
        width:38, 
        height: 38, 
        position:"absolute", 
        textAlign:"center", 
        zIndex:1, 
        top: Platform == "ios" ? 14 : 10, 
        right:3
    },

}