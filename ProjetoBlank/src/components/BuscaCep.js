import React, { useState } from 'react';
import { View, ScrollView, Keyboard } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text, Menu } from 'react-native-paper';
import { styles } from './BuscaCepStyle';

export default function BuscaCep() {
  const [cepDigitado, setCepDigitado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [endereco, setEndereco] = useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    estado: '',
    numero: '',
    complemento: ''
  });

  const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  // Aplica o arredondamento em todos os TextInputs do Paper
  const temaInput = { roundness: 12 };

  const realizarBusca = async () => {
    if (cepDigitado.length < 8) {
      alert("Por favor, digite um CEP válido.");
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    setMostrarResultados(false);

    let url = `https://viacep.com.br/ws/${cepDigitado}/json/`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.erro) {
        setEndereco({
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          estado: data.uf || '', 
          complemento: data.complemento || '',
          numero: '', 
        });
        setMostrarResultados(true); 
      } else {
        alert("CEP não encontrado!");
      }
    } catch (error) {
      console.log("Erro: " + error);
      alert("Erro ao buscar o CEP.");
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar tudo e voltar ao estado inicial
  const limparCampos = () => {
    setCepDigitado('');
    setEndereco({
      logradouro: '',
      bairro: '',
      localidade: '',
      estado: '',
      numero: '',
      complemento: ''
    });
    setMostrarResultados(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text variant="headlineSmall" style={styles.titulo}>Consulta de Endereço</Text>

        <TextInput
          label="Digite o CEP"
          value={cepDigitado}
          onChangeText={setCepDigitado}
          keyboardType="numeric"
          maxLength={8}
          mode="outlined"
          theme={temaInput}
          style={styles.inputBusca}
          left={<TextInput.Icon icon="map-marker" />}
        />

        <Button 
          mode="contained" 
          onPress={realizarBusca} 
          disabled={loading || cepDigitado.length < 8}
          style={styles.botaoBusca}
          buttonColor="#8A2BE2" /* Roxo/Violeta vibrante */
          icon="magnify"
        >
          Buscar CEP
        </Button>

        {loading && <ActivityIndicator size="large" color="#8A2BE2" style={styles.loading} />}

        {mostrarResultados && !loading && (
          <View>
            <View style={styles.divider} />

            <TextInput 
              label="Logradouro" 
              value={endereco.logradouro} 
              onChangeText={t => setEndereco({...endereco, logradouro: t})}
              mode="outlined" 
              theme={temaInput}
              style={styles.input} 
            />

            <View style={styles.row}>
              <TextInput 
                label="Número" 
                value={endereco.numero} 
                onChangeText={t => setEndereco({...endereco, numero: t})}
                mode="outlined" 
                theme={temaInput}
                keyboardType="numeric"
                style={styles.inputMetade} 
              />
              <TextInput 
                label="Complemento" 
                value={endereco.complemento} 
                onChangeText={t => setEndereco({...endereco, complemento: t})}
                mode="outlined" 
                theme={temaInput}
                style={styles.inputMetade} 
              />
            </View>

            <TextInput 
              label="Bairro" 
              value={endereco.bairro} 
              onChangeText={t => setEndereco({...endereco, bairro: t})}
              mode="outlined" 
              theme={temaInput}
              style={styles.input} 
            />

            <View style={styles.row}>
              <TextInput 
                label="Cidade" 
                value={endereco.localidade} 
                onChangeText={t => setEndereco({...endereco, localidade: t})}
                mode="outlined" 
                theme={temaInput}
                style={styles.inputMetade} 
              />
              
              <View style={styles.inputMetade}>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TextInput
                      label="Estado"
                      value={endereco.estado}
                      mode="outlined"
                      theme={temaInput}
                      right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
                      onChangeText={t => setEndereco({...endereco, estado: t})}
                    />
                  }
                >
                  <ScrollView style={{ maxHeight: 200 }}>
                    {ufs.map((uf) => (
                      <Menu.Item 
                        key={uf} 
                        onPress={() => {
                          setEndereco({...endereco, estado: uf});
                          setMenuVisible(false);
                        }} 
                        title={uf} 
                      />
                    ))}
                  </ScrollView>
                </Menu>
              </View>
            </View>

            {/* Novo Botão de Limpar */}
            <Button 
              mode="contained" 
              onPress={limparCampos} 
              style={styles.botaoLimpar}
              buttonColor="#4A148C" /* Roxo fechado/escuro */
              icon="delete-sweep"
            >
              Limpar Campos
            </Button>

          </View>
        )}
      </View>
    </ScrollView>
  );
}