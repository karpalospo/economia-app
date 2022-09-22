import React from 'react';
import NavigationStack from './src/navigation/NavigationStack';
import UtilitiesContext from './src/context/UtilitiesContext';
import { useFonts } from 'expo-font';

export default function App() {

	const [loaded] = useFonts({
		Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
		RobotoB: require('./assets/fonts/Roboto-Bold.ttf'),
	});

	if (!loaded) return null
	
	return (
		<>
			<UtilitiesContext.Provider>
				<NavigationStack />
			</UtilitiesContext.Provider>
		</>
	)
}