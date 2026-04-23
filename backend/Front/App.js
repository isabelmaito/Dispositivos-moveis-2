import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native';


export default function App() {
  let url = 'http://localhost:3000/';
  //simular get
  const Find=() => {
    fetch(url)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(erro => { console.log(erro)})

    //adicionar usuário
const insertOne=()=> {
  fetch(url + 'add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({name: 'Maria'}),
  })
}

const deleteOne=(x)=> {
  fetch(`${url}/${x}`, {
    method: 'DELETE',
  })
}

return (
  <View style={styles.container}>
    <Button
      title='insertOne()'
      onPress={() => insertOne()}
    />
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
