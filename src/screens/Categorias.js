import React, { useState, useEffect, useRef, useContext }  from "react";
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Dimensions  } from "react-native";

import { UtilitiesContext } from '../context/UtilitiesContext'

import Header from "../components/Header";
import { styles } from '../global/styles';
import BottomMenu from "../components/BottomMenu";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons'; 
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import Title from "../components/Title";
import { Arrayfy, sortByKey } from "../global/functions";
import ProductList from "../components/ProductList";
import { getProducts } from "../services/products";
import { API, URL } from "../services/services";

import axios from 'axios';

const window = Dimensions.get("window");
const PAGE_WIDTH = window.width;


const sorts = {
    "01001": 20,
    "01002": 2,
    "01004": 2,
    "01005": 2,
    "01007": 2,
    "02001": 12,
    "02002": 13,
    "02003": 14,
    "02004": 12,
    "02005": 11,
    "02006": 15,
    "02007": 11,
    "02008": 19,
    "03001": 15,
    "03002": 10,
    "03003": 18,
    "03004": 17,
    "03005": 16,
    "03006": 9,
    "03007": 8,
    "03008": 2,
    "04001": 7,
    "04002": 6,
    "07001": 5,
    "07003": 2,
    "07006": 2,
    "07007": 2,
}


const Categoria = ({navigation}) => {

    const [categorias, setCategorias] = useState([])
    const [subcategorias, setSubcategorias] = useState([])
    const [productos, setProductos] = useState([])
    const [productosLoading, setProductosLoading] = useState(false)
    const [currentCat, setCurrentCat] = useState(null)
    const [currentSub, setCurrentSub] = useState(null)
    

    const { params, user, location } = useContext(UtilitiesContext)

    useEffect(() => {
        let cats = [];
        (async function () {
            try {
                const {data} = await axios.post(`${URL.HOST}/api/categorias/${location.id}`, {marca: "ECO", canal: "APP"})
                if(data.success === true) {
                    data.data.forEach(grupo => {
                        grupo.Categorias.forEach(cat => {
                            if(["01001"].includes(cat.IdCategoria)) return;
                            cats.push({id: cat.IdCategoria, title: cat.Categoria, subs: cat.Subcategorias})
                        })
                    })
                    setCategorias(cats.filter(item => !["Medicamentos", "Genéricos", "Hospitalarios", "Regulados", "Ortopédicos"].includes(item.title)))
                }
            } catch(err) {console.log(err)}
        })();

    }, [location])

    const baseOptions =  {
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH / 2,
    }

    const selectCat = (cat) => {
        console.log(cat)
        let subs = []
        cat.subs.forEach(item => {
            if(item.visible) subs.push({id: item.IdSubcategoria, title: item.Subcategoria})
        })
        setCurrentCat(cat)
        setProductos([])
        setSubcategorias(subs)
        selectSub(subs[0], cat)
    }

    const selectSub = async (sub, cat) => {
        if(!cat) cat = currentCat
        setCurrentSub(sub)
        setProductos([])
        setProductosLoading(true)
        const products = await getProducts(`cats`, params.cc.id, user, {cat: cat.id, sub: sub.id})
        setProductosLoading(false)
        setProductos(products)
    }

    return(
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
            
            {/*<Carousel
                {...baseOptions}
                loop={true}
                ref={ref}
                style={{ width: '100%' }}
                autoPlay={true}
                autoPlayInterval={4000}
                data={[0,1,2]}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ item, index }) => <View style={{width:"100%", height:"100%", backgroundColor:"yellow"}}><Text>{item}</Text></View>}
            /> */}

            <LinearGradient
                colors={['#fff', '#eee']}
                start={[1, 0]}
                end={[1, 1]}
                location={[0, 0.5]}
                style={{position:"absolute", top:20, width:"100%", height:"100%", zIndex:-1}}
            />
            <Header navigation={navigation} mode="short" />

            {/*<FlatList 
                keyExtractor={(item, index) => `key${item.id}`}
                data={[{id:0}]}
                contentContainerStyle={{paddingBottom:90}}
                renderItem={({ item, index }) => */}
                    <View style={{flex:1}}>
                        {currentCat && 
                            <View style={{flex:1}}>
                                <View style={{paddingHorizontal:10, paddingVertical:8}}>
                                    <Title title={currentCat.title} onBack={() => setCurrentCat(null)} />
                                </View>
                                <View style={{paddingBottom:10}}>
                                    <FlatList 
                                        keyExtractor={(item, index) => `subs_${item.id}`}
                                        data={subcategorias}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{paddingLeft:10}}
                                        renderItem={({ item, index }) => {
                                            const isCurrent = currentSub && item.id == currentSub.id
                                            return (
                                                <TouchableOpacity activeOpacity={0.7}  style={[_styles.subcat, isCurrent ? {backgroundColor:"#1B42CB", borderWidth: 0} : {}]} onPress={() => selectSub(item)}>
                                                    <Text style={[_styles.subText, isCurrent ? {color:"white"} : {} ]}>{item.title}</Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <ProductList items={productos} loading={productosLoading} paddingBottom={90} />
                                </View>
                            </View>
                        }
                        {currentCat == null && 
                            <FlatList 
                                keyExtractor={(item, index) => item.id}
                                data={categorias}
                                numColumns={2}
                                contentContainerStyle={{padding:10, paddingBottom:80}}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.7} style={_styles.itemCont} onPress={() => selectCat(item)}>
                                            <View style={_styles.item}>
                                                <Text style={_styles.itemText}>{item.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        }
                    </View>
            {/*}        
                }
            />*/}

            <BottomMenu navigation={navigation} />
        </SafeAreaView>
    )

}

export default Categoria 

const _styles = {
    
    itemCont: {flex:0.5, padding: 10,},
    item: {backgroundColor: "#ffffff", borderWidth:0.5, borderColor:"#ccc", justifyContent: "flex-end", borderRadius: 10, padding: 10, minHeight:60},
    itemText: {fontFamily:"Tommy"},
    
    subcat: {backgroundColor: "#ffffff", borderWidth:0.5, borderColor:"#ccc", marginHorizontal:6, justifyContent: "flex-end", borderRadius: 10, padding: 10},
    subText: {fontFamily:"TommyR"},
}