import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { AsyncStorage, Platform } from "react-native";
import { PANEL_API } from '../../services/service';


export const RegisterForPushNotificationsAsync = async (email) => 
{
    let storageDeviceId = {
        deviceId: '',
        email,
    }

    try {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;  
    
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
    
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }
    
        let registerDevice = true;
        storageDeviceId = await AsyncStorage.getItem('deviceId');
        
        if(!storageDeviceId)
        {
            // Get the token that uniquely identifies this device
            storageDeviceId = {
                deviceId: await Notifications.getExpoPushTokenAsync(),
                email,
            }
        }
        else
        {
            if(storageDeviceId.email == email)
            {
                registerDevice = false;
            }
        }

        if(registerDevice)
        {
            // POST the token to your backend server from where you can retrieve it to send push notifications.
            const res = await PANEL_API.POST.PerformRegisterDeviceForPushNotification(email, storageDeviceId.deviceId, Platform.OS)
            
            if(!res.error)
            {
                await AsyncStorage.setItem('deviceId', JSON.stringify(storageDeviceId))
            }
        }


    } catch (error) {
        
    }

    return storageDeviceId;
}
