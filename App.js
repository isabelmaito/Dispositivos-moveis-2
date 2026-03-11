import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, ActivityIndicator , TextInput} from 'react-native';

export default function App() {
    const [ cep, setCep ] = useState([]);
    const [loading, setLoading] = useState(false);


// API FETCH
  const BuscaCep= async(x)=>{
    setLoading(true);
    let url = `https://viacep.com.br/ws/${x}/json/`
    console.log(`Acessando ${url}`)
    await fetch(url)
    .then(resp => resp.json())
    .then(data =>{
      console.log(data)
      setCep(data);
      //navegando os elementos(indice)
      //console.log("-" + ce.bairro)
    })
    .catch(error => console.log("tipo" + error));

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Button 
      title='CEP'
      onPress={()=> BuscaCep('06803180')}>
      </Button>

      <TextInput
        value= {cep.logradouro}
        onChangeText= { text => setCep({...cep, logradouro: text})}
        style= {{ height: 40, width:200, borderColor: 'gray', borderWidth: 1}}
        />

      { loading && <ActivityIndicator size="large" color="blue" />}

      {cep != null &&(
        <View>
        <Text>Rua: {cep.logradouro}</Text>
        <Text>Bairro: {cep.bairro}</Text>
        <Text>CIdade: {cep.localidade}</Text>
        <Text>Estado: {cep.estado}</Text>
        </View>
      )}

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
