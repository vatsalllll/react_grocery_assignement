import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BakeryHomeScreen from './screens/BakeryHomeScreen';
import { appStyles } from './styles/app.styles';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={appStyles.container}>
        <StatusBar style="dark" />
        <BakeryHomeScreen />
      </View>
    </SafeAreaProvider>
  );
}
