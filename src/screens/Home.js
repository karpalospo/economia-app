import React, {useState, useContext, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import Header from "../components/Header";

import Carousel from "../components/Carousel";
import { API } from "../services/services";
import { FormatGroupCategoryItem } from "../utils/formatter";
import { CategoryIconCard } from "../components/CategoryIconCard";
import  Button  from "../components/Button";
import BottomMenu from "../components/BottomMenu";

import { getProducts } from "../services/products";
import { UtilitiesContext } from '../context/UtilitiesContext'
import ProductList from "../components/ProductList";

const Home = ({navigation}) => {


    const [categoryGroups, setCategoryGroups] = useState([]);
    const [banners, setBanners] = useState([]);
    const [inferior, setInferior] = useState([]);
    const [mejoresOfertasList, setMejoresOfertasList] = useState([]);
    const [mejoresLoading, setMejoresLoading] = useState(false);

    const { location, user, clearCartItems, setCupons } = useContext(UtilitiesContext)
         
    useEffect(() => {
        (async function () {

            let res = await API.POST.init({location: location.id, page: "home"}), categoryGroups = []

            if(!res.error) {
                setCupons(res.message.coupons)
                setBanners(res.message.banners.superior)
                setInferior(res.message.banners.inferior)
            }

            res = await API.GET.RetrieveGroupsOfCategories()
            if(!res.error)
            {
                for (let i = 0; i < res.message.data.length; i++) categoryGroups.push(FormatGroupCategoryItem(res.message.data[i]))
            }
            setCategoryGroups(categoryGroups)

            setMejoresLoading(true)
            setMejoresOfertasList([])
            const products = await getProducts("[sales]", location.id, user)
            setMejoresOfertasList(products.products.slice(0, 8))
            setMejoresLoading(false)
         
        })()
    }, [location])
    

    onTapCategory = (id, title, categories) => 
    {
        navigation.navigate('Categorias', {title, id, categories});
    }
    
    onTapImage = (image) => {

        if(image.data.codes) {
            navigation.navigate('Busqueda', {search: `[banner]${image.id}`, location: location.id})
        } else if(image.data.keywords) {
            navigation.navigate('Busqueda', {search: `${image.data.keywords}`, location: location.id})
        }
    }


    return(
        <View style={styles.container}>

            <Header navigation={navigation} />

            <FlatList
                keyExtractor={(item, index) => `item_${index}`}
                data={[0]}
                showsHorizontalScrollIndicator={false}
                renderItem={() => 

                    <View>
                        
                        <Carousel images={banners} onTapImage={onTapImage} />

                        <View style={styles.categoriesContainer}>
                            <FlatList
                                keyExtractor={(item, index) => `groups_${index}`}
                                horizontal={true}
                                data={categoryGroups}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => 
                                    <CategoryIconCard category={item} onTapCategory={onTapCategory} />
                                }
                            />
                        </View>
        
                            <View>

                                {/*<Button title="clear" onPress={() => clearCartItems()} />*/}

                                <View style={{flexDirection:"row", justifyContent:"center"}}>
                                    <View style={styles.h2_cont}>
                                        <Text style={styles.h2}>LAS MEJORES OFERTAS</Text>
                                    </View>
                                </View>

                                <ProductList items={mejoresOfertasList} loading={mejoresLoading} />

                                <View style={{flexDirection:"row", justifyContent:"center"}}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Busqueda', {search: "[sales]", location: location.id})} style={styles.ofertas_cont}>
                                        <Text style={styles.ofertas}>VER TODAS LAS OFERTAS</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            
                        <Carousel images={inferior} onTapImage={onTapImage} />

                        <View style={{height:80}} />

                    </View>
                }
            />

            <BottomMenu navigation={navigation} />
            
        </View>
    )
    


 
}

export default Home

const styles = StyleSheet.create({
    container: {flex: 1, position:"relative"},

    ayudaText: {backgroundColor:"#eee", position:"absolute", width:60, height:17, left:0, bottom:-8, color:"#333", textAlign:"center", fontSize: 12, borderRadius:7, borderWidth: 0.5, borderColor:"#aaa"},
    categoriesContainer: {
        marginHorizontal:5,
        backgroundColor: 'white', 
        paddingBottom: 10, 
        paddingTop:10,
        marginVertical:20,
        minHeight:100,
        borderRadius: 15
    }, 
    categoriesTitleText: {margin: 15, fontSize: 14, fontFamily: "Roboto", color: "#A5A5A5"}, 
    categoryItemConteiner: {alignItems: 'center', width: 100, height: 120, padding: 5}, 
    categoryItemImageContainer: {width: 70, height: 70, borderRadius: 35, overflow: 'hidden',},
    categoryItemImage: {width: '100%', height: '100%'},
    categoryItemNameText: {fontSize: 10, color: "#657272", textAlign: 'center', marginTop: 5, fontFamily: "Roboto"},

    featuredProductItemContainer: {margin: 10},

    sponsoredBrandItemContainer: {margin: 10},

    bestSellerItemContainer: {margin: 10},

    loadingIndicatorContainer: {width: '100%', alignItems: 'center', padding: 15, },

    ofertas_cont: {
        marginVertical: 40, 
        paddingHorizontal: 30, 
        borderRadius:7, 
        backgroundColor: "#ff2c6e",
        elevation: 6,
        shadowColor: "#000", 
        shadowOffset: {width: 0, heigth: 0}, 
        shadowOpacity: 7, 
        shadowRadius: 20,
    },

    ofertas: {
        textAlign:"center", 
        padding:12, 
        fontSize: 14, 
        color: "white", 
        fontFamily: "RobotoB",
    },

    h2: {
        textAlign:"center",
        color:"#555",
        fontSize: 15,
        fontFamily: "RobotoB"
    },

    h2_cont: {
        marginVertical:20,
        width:"60%",
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor: "#eeeeee",
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 30,
        elevation: 6,
        shadowColor: "#000", 
        shadowOffset: {width: 0, heigth: 0}, 
        shadowOpacity: 7, 
        shadowRadius: 20,
    }
})