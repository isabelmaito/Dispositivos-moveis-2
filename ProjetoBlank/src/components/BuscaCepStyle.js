import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16, // Deixei o cartão um pouco mais arredondado também
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputBusca: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  botaoBusca: {
    alignSelf: 'center', // Centraliza o botão
    width: '60%', // Deixa ele menor, sem ocupar a tela toda
    borderRadius: 24, // Bordas bem arredondadas
    marginTop: 8,
  },
  botaoLimpar: {
    marginTop: 16,
    borderRadius: 24, // Bordas arredondadas
  },
  loading: {
    marginVertical: 30,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputMetade: {
    flex: 0.48,
    marginBottom: 16,
    backgroundColor: '#fff',
  }
});