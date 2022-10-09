import React from 'react';
import NavigationStack from './src/navigation/NavigationStack';
import UtilitiesContext from './src/context/UtilitiesContext';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';

export default function App() {

	const [loaded] = useFonts({
		Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
		RobotoB: require('./assets/fonts/Roboto-Bold.ttf'),
		Coco: require('./assets/fonts/Cocogoose-Pro-trial.ttf'),
		Tommy: require('./assets/fonts/Tommy-Bold.otf'),
		TommyM: require('./assets/fonts/Tommy-medium.otf'),
		TommyL: require('./assets/fonts/Tommy-light.otf'),
		TommyR: require('./assets/fonts/Tommy-regular.otf'),
	});

	if (!loaded) return null
	
	return (
		<>
			<UtilitiesContext.Provider>
				<NavigationStack />
				<Toast />
			</UtilitiesContext.Provider>
		</>
	)
}