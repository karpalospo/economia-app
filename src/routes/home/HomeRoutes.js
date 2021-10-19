import React from 'react';
import { createStackNavigator,  } from "react-navigation-stack";
import { View } from "react-native";
import Home from "../../views/home/HomeView";
import SponsoredBrand from "../../views/categories/SponsoredBrandView";
import Header from "../../components/header/Header";
import Category from '../../views/categories/CategoryView';
import ProductDetail from '../../views/products/ProductDetailView';
import ShopCart from '../../views/shop_cart/ShopCartView';
import AllSponsoredBrands from '../../views/brand/AllSponsoredBrandsView';
import AddNewAddressView from '../../views/address/AddNewAddressView';
import { BestSellerProductsView } from '../../views/products/BestSellerProductsView';
import DictionaryView from '../../views/dictionary/DictionaryView';
import GroupOfCategories from '../../views/categories/GroupOfCategoriesView';

export const HomeStack = createStackNavigator({
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    SponsoredBrand: {
      screen: SponsoredBrand,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    Category: {
      screen: Category,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    GroupOfCategories: {
      screen: GroupOfCategories,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    ProductDetail: {
      screen: ProductDetail,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    AllSponsoredBrands: {
      screen: AllSponsoredBrands,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    BestSellerProducts: {
      screen: BestSellerProductsView,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },

    ShopCart: {
      screen: ShopCart,
      navigationOptions: ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
          headerShown: false,
        }
      },
    },
    AddNewAddressFromCart: {
      screen: AddNewAddressView,
      navigationOptions: ({ navigation }) => ({
        headerShown: false,
      })
    }, 
    Dictionary: {
      screen: DictionaryView,
      navigationOptions: ({ navigation }) => ({
        headerShown: false,
      })
    }, 

    
}, {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      gestureEnabled: false,
      // headerStyle: {
      //   height: 65
      // }
    }
})