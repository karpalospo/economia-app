import React, {useState, useContext, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

import Header from "../components/Header";
import Carousel from "../components/Carousel";
import  Bola  from "../components/Bola";
import BottomMenu from "../components/BottomMenu";
import ProductList from "../components/ProductList";

import { API } from "../services/services";
import { getProducts } from "../services/products";
import { UtilitiesContext } from '../context/UtilitiesContext'
import * as Updates from 'expo-updates';
import { styles } from '../global/styles';

const dias = [

    {id:"lunes", image: require('../../assets/icons/lun1.png'), image2: require('../../assets/icons/lun2.png'), title: "Lunes de Belleza"},
    {id:"martes", image: require('../../assets/icons/mar1.png'), image2: require('../../assets/icons/mar2.png'), title: "Martes de Aseo, Personal y Hogar"},
    {id:"miercoles", image: require('../../assets/icons/mie1.png'), image2: require('../../assets/icons/mie2.png'), title: "Día de la Economía"},
    {id:"jueves", image: require('../../assets/icons/jue1.png'), image2: require('../../assets/icons/jue2.png'), title: "Jueves de Medicamentos"},
    {id:"viernes", image: require('../../assets/icons/vie1.png'), image2: require('../../assets/icons/vie2.png'), title: "Baby Viernes"},
    {id:"ofertas", image: require('../../assets/icons/esp1.png'), image2: require('../../assets/icons/esp2.png'), title: "Ofertas Imperdibles"},
    {id:"estrella", image: require('../../assets/icons/est1.png'), image2: require('../../assets/icons/est2.png'), title: "Productos Estrella"},

]

const Home = ({navigation}) => {

    const [banners, setBanners] = useState([]);
    const [inferior, setInferior] = useState([]);
    const [mejoresOfertasList, setMejoresOfertasList] = useState([]);
    const [mejoresLoading, setMejoresLoading] = useState(false);
    const [showLocation, setShowLocation] = useState(false);

    const { location, user, setCupons, params, setParams } = useContext(UtilitiesContext)
         
    useEffect(() => {
        (async function () {
           
            setMejoresLoading(true)
            setMejoresOfertasList([])

            let res = await API.POST.init({location: location.id, page: "home"}), d;

            if(!res.error) {
                d = res.message
                setCupons(d.coupons)
                setBanners(d.banners.superior)
                setInferior(d.banners.inferior)
                setParams({
                    dia: d.day,
                    centroscostos: d.centroscostos,
                    cc: d.current_centrocosto,
                    date: d.date,
                    noPromoCats: d.noPromoCats,
                    noPromoSubs: d.noPromoSubs,
                    proveedores: d.proveedores,
                    user: d.user,
                    pestrella: d.pestrella
                })
                if(location.id == undefined) {  
                    return setShowLocation(true)
                }
            }
  
            const products = await getProducts("[sales]", location.id, user)
            setMejoresOfertasList(products.products.slice(0, 8))
            setMejoresLoading(false)
         
        })()
    }, [location])

    useFocusEffect(
        React.useCallback(() => {
            //checkUpdates()
        }, [])
    );

    // const checkUpdates = async () => {
    //     Updates.checkForUpdateAsync().then((res) => {
    //         if (res.isAvailable === true) {
    //             getNewVersion()
    //         }
    //     }).catch((e) => console.log('Error de update', e))
    // }

    const getNewVersion = async () => {
        Updates.fetchUpdateAsync().then((res) => {
            if (res.isNew === true) {
                Updates.reloadAsync()
                .then((res) => console.log(res))
                .catch((e) => console.log('Ups!', 'Ha ocurrido un error'))
            }
        }).catch((e) => {})
    }


    const onTapImage = (image) => {

        if(image.data.codes) {
            navigation.navigate('Busqueda', {search: `[banner]${image.id}`, location: location.id})
        } else if(image.data.keywords) {
            navigation.navigate('Busqueda', {search: `${image.data.keywords}`, location: location.id})
        }
    }

    const tapBola = (item) => {
        if(item.id == "ofertas") navigation.navigate("Busqueda", {search: "[sales]"})
        if(item.id == "estrella") navigation.navigate("Busqueda", {search: "[banner]" + params.pestrella})
        if(item.id == "lunes") navigation.navigate("Busqueda", {search: "[banner]391"})
        if(item.id == "martes") navigation.navigate("Busqueda", {search: "[banner]393"})
        if(item.id == "miercoles") navigation.navigate("Busqueda", {search: "[cats]medicamentos/medicamentos"})
        if(item.id == "jueves") navigation.navigate("Busqueda", {search: "[cats]medicamentos/medicamentos"})
        if(item.id == "viernes") navigation.navigate("Busqueda", {search: "[banner]388"})

    }

    return(
        <View style={_styles.container}>

            <Header navigation={navigation} />

            <FlatList
                keyExtractor={(item, index) => `item_${index}`}
                data={[0]}
                showsHorizontalScrollIndicator={false}
                renderItem={() => 

                    <View>
                        
                        <Carousel autoscroll={true} images={banners} onTapImage={onTapImage} />

                        <View style={_styles.diasCont}>
                            {!mejoresLoading &&

                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                {dias.map((item, index) => {
                                    let dia = params.dia
                                    if(dia == 0) {
                                        if(index == 2 || index == 3 || index == 4) return
                                    } else if(dia == 5) {
                                        if(index < 5 && index != dia && index != dia - 1 && index != dia - 2) return
                                    } else if(dia == 6) {
                                        if(index < 5 && index != dia && index != dia - 1 && index != dia - 2 && index != dia - 3) return
                                    } else {
                                        if(index < 5 && index != dia && index != dia - 1) return
                                    }
                                    return (
                                        <Bola key={index} item={item} enable={index + 1 == dia || index > 4} onTap={() => tapBola(item)} />
                                    )
                                })}
                            </View>
                            }
                        </View>
                        
        
                            <View>

                                <View style={{flexDirection:"row", justifyContent:"flex-start", paddingBottom:8}}>
                                    <Text style={styles.h2}>Ofertas Especiales</Text>
                                </View>

                                <ProductList items={mejoresOfertasList} loading={mejoresLoading} />

                                <View style={{flexDirection:"row", justifyContent:"center"}}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Busqueda', {search: "[sales]", location: location.id})} style={_styles.ofertasCont}>
                                        <Text style={_styles.ofertas}>VER TODAS LAS OFERTAS</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            
                        <Carousel images={inferior} onTapImage={onTapImage} />

                        <View style={{height:80}} />

                    </View>
                }
            />

            <BottomMenu navigation={navigation} showLocation={showLocation} />
            
        </View>
    )
    


 
}

export default Home

const _styles = StyleSheet.create({
    container: {flex: 1, position:"relative"},

    ayudaText: {backgroundColor:"#eee", position:"absolute", width:60, height:17, left:0, bottom:-8, color:"#333", textAlign:"center", fontSize: 12, borderRadius:7, borderWidth: 0.5, borderColor:"#aaa"},
    diasCont: {
        marginVertical: 20,
        marginHorizontal: 10,
        backgroundColor: 'white', 
        minHeight: 100,
        borderRadius: 15
    }, 

    ofertasCont: {
        marginVertical: 20, 
        paddingHorizontal: 30, 
        borderRadius:7, 
        backgroundColor: "#ff2c6e",
        elevation: 6,
        shadowColor: "rgba(0,0,0,0.3)", 
        shadowOffset: {width: 1, heigth: 2}, 
        shadowOpacity: 2, 
        shadowRadius: 8
    },

    ofertas: {
        textAlign:"center", 
        padding:12, 
        fontSize: 14, 
        color: "white", 
        fontFamily: "RobotoB",
    },




})