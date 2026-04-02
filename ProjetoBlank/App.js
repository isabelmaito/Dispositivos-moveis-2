import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import { styles } from './src/components/BuscaCepStyle';
import BuscaCep from './src/components/BuscaCep';

export default function App() {
  const [cepDigitado, setCepDigitado] = useState('');
  const [loading, setLoading] = useState(false);
    
  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    estado: '',
    numero: '',
    complemento: ''
  });

  const BuscaCep = async () => {
    if (cepDigitado.length < 8) return; // Evita buscar CEP incompleto

    setLoading(true);
    let url = `https://viacep.com.br/ws/${cepDigitado}/json/`;
    console.log(`Acessando ${url}`);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      
      if (!data.erro) {
        setEndereco({
          ...endereco, // Mantém o que já tem (como o número que não vem da API)
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          estado: data.uf, 
          complemento: data.complemento,
        });
      }
    } catch (error) {
      console.log("Erro: " + error);
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>Buscador de CEP</Text>

      {/* Campo para digitar o CEP */}
      <TextInput
        label="Digite o CEP"
        value={cepDigitado}
        onChangeText={setCepDigitado}
        keyboardType="numeric"
        maxLength={8}
        mode="outlined"
        style={styles.input}
      />

      <Button 
        mode="contained" 
        onPress={BuscaCep} 
        disabled={loading}
        style={styles.botao}
      >
        Busca CEP
      </Button>

      {/* Ícone de carregamento */}
      {loading && <ActivityIndicator size="large" style={styles.loading} />}

      {/* Campos de resultado exibidos como inputs */}
      {!loading && (
        <View style={styles.formResultados}>
          <TextInput label="Logradouro" value={endereco.logradouro} mode="outlined" style={styles.input} onChangeText={t => setEndereco({...endereco, logradouro: t})} />
          <TextInput label="Bairro" value={endereco.bairro} mode="outlined" style={styles.input} onChangeText={t => setEndereco({...endereco, bairro: t})} />
          <TextInput label="Cidade" value={endereco.localidade} mode="outlined" style={styles.input} onChangeText={t => setEndereco({...endereco, localidade: t})} />
          <TextInput label="Estado" value={endereco.estado} mode="outlined" style={styles.input} onChangeText={t => setEndereco({...endereco, estado: t})} />
          <TextInput label="Número" value={endereco.numero} mode="outlined" style={styles.input} keyboardType="numeric" onChangeText={t => setEndereco({...endereco, numero: t})} />
          <TextInput label="Complemento" value={endereco.complemento} mode="outlined" style={styles.input} onChangeText={t => setEndereco({...endereco, complemento: t})} />
        </View>
      )}
    </ScrollView>
  );
}