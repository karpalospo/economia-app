import React from "react";
import { View, StyleSheet, Text, FlatList, TouchableOpacity, AsyncStorage, Alert } from "react-native";
import _ from "lodash";

import { COLORS, FONTS } from "../../utils/constants";
import Carousel from "../../components/Carousel";
import ProductCard from "../../components/product/VerticalProductCard";
import { API, SEARCH_BY, PANEL_API } from "../../services/service";
import { FormatProduct, FormatBannerItem } from "../../utils/formatter";
import { FullWidthLoading } from "../../components/loading/FullWidthLoading";
import { HeaderWithTitleAndBackButton } from "../../components/header/HeaderWithTitleAndBackButton";
import EmptyState from "../../components/empty_state/EmptyState";
import { sortByKey} from "../../utils/helper";
import Header from "../../components/header/Header";


import { ProductDetail } from "../../components/product/ProductDetail";



export default class Category extends React.Component
{
    state = {

        loading: true,

        currPage: 1,

        selectedSubCategory: this.props.navigation.getParam('selectedSubCategory', ''),
        selectedCategory: 0,

        availableCategories: this.props.navigation.getParam('subCategories', []),

        categoryGallery: [],

        categoryProducts: [],

        ads: null,

        addToCartVisible: false,
        selectedProduct: {},

        productID: null,

        showDetail: false

    }

    UNSAFE_componentWillMount()
    {
        this.page = 1;
        this.lastPage = -1;
        this.lastSelectedSubcategoryId = 0;
    }


    async componentDidMount()
    {
        await this.initialize()

    }

    initialize = async () =>
    {
        const location = JSON.parse(await AsyncStorage.getItem('location'));
        
        if(location)
        {
            this.location = location.id
        }  

        let selectedCategory = 0;

        if(this.state.selectedSubCategory != '')
        {
            const selectedCategoryIndex = _.findIndex(this.state.availableCategories, {id: this.state.selectedSubCategory});

            if(selectedCategoryIndex != -1)
            {
                selectedCategory = selectedCategoryIndex;
            }
        }

        
        this.setState({selectedCategory}, async () => {
            this.lastSelectedSubcategoryId = this.state.availableCategories[selectedCategory].id;
            await this.getProductsFromSubCategory(this.state.availableCategories[selectedCategory].id)
        })

    }



    getProductsFromSubCategory = async (subCategoryId) =>
    {
        if(this.lastSelectedSubcategoryId != subCategoryId)
        {
            this.page = 1
            this.lastSelectedSubcategoryId = subCategoryId;
        }

        let categoryProducts = this.page == 1 ? [] : this.state.categoryProducts;
        
        this.setState({loading: true, categoryProducts, currPage: this.page})
        const res = await API.GET.RetrieveProductsFromSubcategory(this.location, subCategoryId, {page: this.page})


        const lastCategoryProductsLength = categoryProducts.length;

        if(!res.error)
        {

            const res2 = await API.POST.PerformRetrieveProductsFromCodeList(res.message.map(item => item.codigo), this.location);

            if(typeof(res2.message) != "string")
            {
                let items = sortByKey([...res2.message.data], "Porcentaje", "desc")

                for (let i = 0; i < items.length; i++) {
                    const element = items[i]
                    if(!element.codigo) continue
                    categoryProducts.push(FormatProduct(element));
                }
               
            }
            
            this.lastPage = this.page;
            if(lastCategoryProductsLength != categoryProducts.length)
            {
                this.page++;
            }
        } else {
            Alert.alert('Atención', 'No se pudo obtener el listado de productos pertenecientes a esta categoría.', 
            [
                { text: 'Reintentar', onPress: async () => await this.getProductsFromSubCategory(subCategoryId) },
                { text: 'Cancelar' }
            ])
        }

        this.setState({loading: false, categoryProducts})

    }


    onSelectCategory = (selectedCategory) => 
    {
        this.setState({selectedCategory}, async () => 
        {
            await this.getProductsFromSubCategory(this.state.availableCategories[this.state.selectedCategory].id)
        })
    }

    onTapSingleProduct = (productId, productName) => 
    {
     
        this.setState({showDetail:true, productID: productId})
        
    }

    onCloseProductDetail = () => {
        this.setState({showDetail: false})
    }



    handleLoadMore = async () =>
    {
        if(!this.state.loading && this.lastPage !== this.page)
        {
            await this.getProductsFromSubCategory(this.state.availableCategories[this.state.selectedCategory].id);
        }
    }


    renderFooter = () =>
    {
        if(!this.state.loading || this.lastPage === this.page || this.state.currPage === 1)
        {
            return null;
        } 

        return (<FullWidthLoading />)
    }

    render()
    {
        return(
            <View style={styles.container}>

                <Header navigation={this.props.navigation} />


                <FlatList
                    keyExtractor={(item, index) => `item_${index}`}
                    data={[0]}
                    renderItem={() => 

                        <View>

                            <HeaderWithTitleAndBackButton title='Categorías' subtitle = {this.props.navigation.getParam('title', '')} onPress={() => this.props.navigation.goBack()} />

                            <View>
                                {this.state.availableCategories.length > 0 &&
                                <FlatList
                                    initialScrollIndex={this.state.selectedCategory}
                                    getItemLayout={(data, index) => (
                                        {length: (styles.categoryItemContainer.width + styles.categoryItemContainer.marginRight), offset: (styles.categoryItemContainer.width + styles.categoryItemContainer.marginRight) * index, index}
                                    )}
                                    keyExtractor={(item, index) => `category_${index}`}
                                    horizontal={true}
                                    extraData={this.state}
                                    data={this.state.availableCategories}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={[styles.categoryItemContainer, {marginLeft: index == 0 ? 15 : 0}]}>
                                                <TouchableOpacity style={[styles.categoryItemButton, {borderBottomWidth: this.state.selectedCategory == index ? styles.categoryItemButton.borderBottomWidth : 0 }]} 
                                                disabled={this.state.loading}
                                                onPress={this.onSelectCategory.bind(this, index, item.id)}>
                                                    <Text style={[styles.categoryItemButtonText, {color: this.state.selectedCategory == index ? styles.categoryItemButtonText.color : COLORS._A5A5A5}]}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                />}
                            </View>
            
                            <View style={{marginTop:10}}>
                                {(this.state.loading && this.state.currPage === 1) && <FullWidthLoading />}

                                {(!this.state.loading && this.state.categoryProducts.length === 0) && <EmptyState mainTitle = 'Lo sentimos...' subTitle = 'No encontramos productos en esta categoría...' />}

                                <FlatList
                                    numColumns={2}
                                    keyExtractor={(item, index) => `product_${index}`}
                                    data={this.state.categoryProducts}
                                    extraData={this.state}

                                    onEndReached={this.handleLoadMore}
                                    onEndReachedThreshold={0.9}
                                    ListFooterComponent={this.renderFooter}

                                    renderItem={({ item, index }) => {
                                        return (

                                            <ProductCard image={item.image} product={item} onPressCard={this.onTapSingleProduct.bind(this, item.id, item.name)} />
                                        
                                        )
                                    }}
                                /> 

                            </View>


                        </View>

                    } 
                />

                <ProductDetail visible={this.state.showDetail} productID={this.state.productID} onClose={this.onCloseProductDetail.bind(this)} />
            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS._F4F4F4},

    carouselImageContainer: {borderRadius: 10, overflow: 'hidden'},

    categoryItemContainer: {width: 105, paddingHorizontal:7, height:50, marginRight: 6, alignItems: 'center', backgroundColor:"#ddd", borderRadius:8},
    categoryItemButton: {justifyContent: 'center', height: 50},
    categoryItemButtonText: {fontSize: 13, color: "#444", fontFamily: FONTS.BOLD },

})