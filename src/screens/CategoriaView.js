import React, {useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import _ from "lodash";


import { HeaderWithTitleAndBackButton } from "../components/HeaderWithTitleAndBackButton";

import Header from "../components/Header";
import BottomMenu from "../components/BottomMenu";
import ProductList from "../components/ProductList";

import { UtilitiesContext } from '../context/UtilitiesContext'
import { getProducts } from "../services/products";


const CategoriaView = ({navigation, route}) => {

    const {subCategories, id, title } = route.params

    const [availableCategories, setAvailableCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState({})
    const [categoryProducts, setCategoryProducts] = useState([])
    const [loading, setLoading] = useState(false)
    
    const { location, user } = useContext(UtilitiesContext)
    
    useEffect(() => {

        setAvailableCategories(subCategories)
        if(subCategories && subCategories.length > 0) onSelectCategory(subCategories[0])
        
       
    }, [subCategories])

    const onSelectCategory = async (category) => 
    {
        setSelectedCategory(category)
        setCategoryProducts([])
        setLoading(true)
        const res = await getProducts("subcategoria", location.id, user, category.id)
        setLoading(false)
        setCategoryProducts(res.products)
    }

    console.log("availaible", availableCategories)

    return(
        <View style={styles.container}>

            <Header navigation={navigation} />

            <FlatList
                keyExtractor={(item, index) => `item_${index}`}
                data={[0]}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={() => 

                    <View>

                        <HeaderWithTitleAndBackButton subtitle={title} onPress={() => navigation.goBack()} />

                        <View>
                            {availableCategories.length > 0 &&
                            <FlatList
                                initialScrollIndex={availableCategories.findIndex(item => item.id == selectedCategory.id)}
                                getItemLayout={(data, index) => (
                                    {length: (styles.categoryItemContainer.width + styles.categoryItemContainer.marginRight), offset: (styles.categoryItemContainer.width + styles.categoryItemContainer.marginRight) * index, index}
                                )}
                                keyExtractor={(item, index) => `category_${index}`}
                                horizontal={true}
                                data={availableCategories}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={[styles.categoryItemContainer, {marginLeft: index == 0 ? 15 : 0}]}>
                                            <TouchableOpacity 
                                                style={[styles.categoryItemButton, item.id == selectedCategory.id ? {} : {}]} 
                                                disabled={loading}
                                                onPress={() => onSelectCategory(item)}
                                            >
                                                <Text style={[styles.categoryItemButtonText, item.id == selectedCategory.id ? {fontFamily:"RobotoB"} : {}]}>{item.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />}
                        </View>
        
                        <View style={{marginTop:20}}>
                            {(!loading && categoryProducts.length == 0) && <Text style={{padding:20, color:"#555"}}>No encontramos productos en esta categoría...</Text>}
                            <ProductList items={categoryProducts} loading={loading} />
                        </View>
                    </View>
                } 
            />
            <BottomMenu navigation={navigation} />

        </View>
    )
    
}

export default CategoriaView

const styles = StyleSheet.create({
    container: {flex: 1, position:"relative"},

    categoryItemContainer: {minWidth: 105, paddingHorizontal:13, height:50, marginRight: 6, alignItems: 'center', backgroundColor:"#ddd", borderRadius:8},
    categoryItemButton: {justifyContent: 'center', height: 50},
    categoryItemButtonText: {fontSize: 13, color: "#444", fontFamily: "Roboto" },

})