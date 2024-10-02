import React from "react";
import { View, Text, TouchableOpacity, Image, Platform} from "react-native";
import Cantidad from "./Cantidad";
import { f, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from '../global/functions';
import Button from "../components/Button";



const Product = ({mykey, item, itemCart, onTap, onChange, addCart}) => {

    let hasDiscount = item.discount > 0 && !IsExcludedCategory(item.subgrupo36)

    return (
        <View key={mykey} style={styles.container}>
                            
            <TouchableOpacity activeOpacity={0.85} style={styles.imageCont} onPress={onTap}>
                <Image source={item.image} style={styles.mainImage} resizeMode='contain' onError={(error) => {}} />

                <View style={styles.detalle}>
                    <Text style={styles.nombre}>{CapitalizeWord(item.name)}</Text>
                    <View>
                        <View>{hasDiscount && <Text style={styles.precioAntes}>{f(item.antes)}</Text>}</View>
                        <View><Text style={styles.precio}>{f(item.price)}</Text></View>
                        {hasDiscount &&
                            <View style={styles.descCont}>
                                <Text style={styles.descuento}>{`${item.discount}%`}</Text>
                            </View>
                        }
                    </View>
                    <Text style={styles.unidad}>{CapitalizeWords(item.unit)}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.agregarCont}>
                {itemCart && itemCart._quanty > 0 && <Cantidad value={itemCart._quanty} item={item} onChange={onChange} />}
                {!itemCart && <Button title="Agregar" onPress={() => addCart(item)} image={true} /> }
            </View>

        </View>
    )
}

export default Product

const styles = {

    container: {
        flex:0.5, 
        margin: 10,
        paddingTop:10,
        paddingBottom:63,
        backgroundColor: "#FFFFFF",
        borderRadius: 15
    },

    imageCont: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    detalle: {paddingHorizontal: 10, width: '100%'},
    precio: {fontSize: 20, color: "#333", fontFamily: "Tommy"},
    precioAntes: {fontSize: 14, textDecorationLine: 'line-through', color: "#6E7191"},

    nombre: {fontSize: 15, color: "#333", marginVertical: 8, fontFamily: "TommyR", textAlign:"left", minHeight:60},
    unidad: {fontSize: 12, color: "#666", fontFamily: "TommyR", textAlign:"left", height:20, marginTop:5, lineHeight:20},

    agregarCont: {
        position: "absolute",
        left: 0,
        bottom: 13,
        width: '100%', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        marginTop:10,
    },
    descCont: {backgroundColor: "#039855", borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4, marginTop: 7, alignSelf: 'flex-start'},
    descuento: {
        fontSize: 15, 
        color:"white", 
        fontFamily: "Tommy", 
    },

}