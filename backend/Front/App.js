import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View, Text } from "react-native";

export default function App() {
  const url = "http://192.168.50.209:3000";
  const find = () => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((e) => {
        console.log(e);
      });
  };

  const addUser = () => {
    fetch(url + "/add", {
      method: "POST",
      body: JSON.stringify({
        name: "Isabel Maito",
      }),
      headers: {
        "Content-Type": "application/json; charset = UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((e) => console.log(e));
  };
  const deleteUser = (id) => {
    fetch(`${url}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => find()} title="Press me to get" />
      <Button onPress={() => addUser()} title="Press me to add" />
      <Button onPress={() => deleteUser("")} title="Press me to delete" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});