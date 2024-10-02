import React, {useState, useContext, useEffect } from "react";
import { VirtualizedList, View, ActivityIndicator } from 'react-native';

import { UtilitiesContext } from '../context/UtilitiesContext'

import { ProductDetail } from "./ProductDetail";

import Product from "../components/Product";


const ProductList = ({items = [], loading = false, paddingBottom = 0}) => {


    const [showDetail, setShowDetail] = useState(false);
    const [productID, setProductID] = useState(0);

    const { cart, setCartItem } = useContext(UtilitiesContext)



    const onChange = (value, item) => {
        setCartItem(item.id, undefined, value, cart.items[item.id])
    }
    
    const addCart = (item) => {
        setCartItem(item.id, 1, 0, item)
    }

    const getItem = (data, index) => {
        let ret = []
        for (let i = 0; i < 2; i++) {
            const item = data[index * 2 + i]
            if(item != undefined) ret.push(item)
        }
        return ret
    }

    return (
        <View>
            {loading &&
                <View style={{paddingVertical:30}} >
                    <ActivityIndicator color="#1B42CB" size={24} />
                </View>
            }
            <VirtualizedList

                keyExtractor={(item, index) => `items_${index}`}
                data={items}
                getItemCount={data => data.length}
                getItem={getItem}
                contentContainerStyle={{paddingHorizontal:20, paddingBottom}}
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                windowSize={10}
                renderItem={({ item, index }) => 
                    <View key={index} style={{flexDirection:"row"}}>
                        {item.map((product, index2) => {
                            let itemCart = false
                            if(cart.items) itemCart = cart.items[product.id]
                            return (
                                <Product
                                    key={`item${index}${index2}`}
                                    item={product} 
                                    itemCart={itemCart}
                                    addCart={addCart} 
                                    onChange={onChange} 
                                    onTap={() => {setProductID(product.id); setShowDetail(true)}}
                                />
                            )
                        })}
                    </View>
                }
            />
            <ProductDetail visible={showDetail} productID={productID} onClose={() => setShowDetail(false)} addCart={addCart} />
        </View>
    )
}

export default ProductList

