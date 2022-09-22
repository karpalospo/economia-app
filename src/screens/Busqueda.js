import React, {useState, useContext, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';


import Header from '../components/Header';

import { getProducts } from "../services/products";

import ProductList from "../components/ProductList";

import BottomMenu from "../components/BottomMenu";

import { UtilitiesContext } from '../context/UtilitiesContext'




const Busqueda = (props) => {

    const { search } = props.route.params;

    const [searchText, setSearchText] = useState(search)
    const [searchLabel, setSearchLabel] = useState("")
    const [productList, setProductList] = useState([])
    const [loading, setLoading] = useState(false);

    const { location, user } = useContext(UtilitiesContext)


    const searchProducts = async(search) => {
        if(!search || search == "") return
        setSearchText(search)
        setProductList([])

        setLoading(true)

        const products = await getProducts(search, location.id, user)

        setSearchLabel(products.search_label)

        setLoading(false)

        setProductList(products.products)

    }

    useEffect(() => {
        (async function () {
            await searchProducts(searchText)
        })()
    }, [searchText])


    return (
        <View style={styles.container}>

            <Header navigation={props.navigation} searchFunction={searchProducts}/>

            {loading &&
                <View>
                    <View style={styles.resultadoCont}>
                        <View style={{flexDirection:"row", alignItems:"center", paddingRight:10}}>
                            <Text style={{fontSize: 16, color: "#666"}}> Buscando </Text>
                            <Text style={{fontSize: 16, color: "#333", fontFamily: "RobotoB"}}>{searchText}</Text>
                            <Text style={{fontSize: 16, color: "#666"}}>...</Text>
                        </View>
                    </View>
                    <ProductList items={productList} loading={loading} />
                </View>
            }
            {productList.length == 0 && !loading &&
                <View style={styles.emptyContainer}>
                    <Text style={{padding:20, color:"#555"}}>No encontramos resultados para {searchLabel}</Text>
                </View>
            }

            {productList.length > 0 &&
            <FlatList
                keyExtractor={(item, index) => `page_${index}`}
                data={[1]}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item, index }) => 
                    <View style={{flex: 1}}>
                        <View style={styles.resultadoCont}>
                            <View style={{flexDirection:"row", alignItems:"center", paddingRight:10, flex: 1}}>
                                <Text style={{fontSize: 16, color: "#666"}}>Mostrando </Text>
                                <Text style={{fontSize: 16, color: "#333", fontFamily: "RobotoB"}}>{productList.length}</Text>
                                <Text style={{fontSize: 16, color: "#666"}}> productos para </Text>    
                                <Text style={{fontSize: 16, color: "#333", fontFamily: "RobotoB"}}>{searchLabel}</Text>
                            </View>
                        </View>
                        <ProductList items={productList} loading={loading} />
                    </View>
                }
            />
            }

            <BottomMenu navigation={props.navigation} />
            

        </View>
    )
    




}

export default Busqueda

const styles = StyleSheet.create({

    container: {flex: 1},
    resultadoCont: {
        flexDirection: "row", 
        paddingLeft:15, 
        backgroundColor:"white", 
        padding:8, 
        borderBottomWidth: 0.5, 
        borderBottomColor: "#999", 
        justifyContent:"flex-start",
        alignItems: "flex-start",
        paddingVertical: 12
    },
    loadingContainer: {width: '100%', alignItems: 'center', padding: 10},
    
    productsContainer: {justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', paddingHorizontal: '10%',marginTop: "0.1%"},
    productItemContainer: {width: '100%', padding: 10, backgroundColor: "white", borderBottomWidth: .7, borderColor: "#F4F4F4"},

    headerWrapper: {position: 'absolute', top: 0, width: '100%', backgroundColor: 'white'},
    productSuggestionsContainer: {width: '100%', backgroundColor: 'white'},
    searchMatchItemContainer: {width: '100%', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 2, borderColor: "#F4F4F4"},
    searchMatchItemText: {fontSize: 16, color: "#657272", fontFamily: "Roboto" },

    emptyContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 15},
})