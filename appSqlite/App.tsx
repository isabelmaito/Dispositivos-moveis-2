import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { Banco, createTable, inserirUsuario } from './db';


export default function App() {

  useEffect(() => {
    async function Main(){
      const rbd = await Banco();
      await createTable(rbd);
      inserirUsuario(rbd, 'John Doe', 'john.doe@example.com');
      
    }
    Main();
  },[])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
