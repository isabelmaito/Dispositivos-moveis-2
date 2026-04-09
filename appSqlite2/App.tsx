import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Modal, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView, useWindowDimensions,
} from 'react-native';
import { Banco, createTable, inserirUsuario, selectUsuarios, atualizarUsuario, deletaUsuario, buscarCep } from './Conf/Bd';
import type { Usuario } from './Conf/Bd';
import { useEffect, useState, useCallback } from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';

export default function App() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const contentMaxWidth = isWeb ? Math.min(width * 0.9, 560) : undefined;

  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
  const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState(false);
  const [idParaEditar, setIdParaEditar] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCep, setEditCep] = useState('');
  const [editLogradouro, setEditLogradouro] = useState('');
  const [editNumero, setEditNumero] = useState('');
  const [editComplemento, setEditComplemento] = useState('');
  const [editBairro, setEditBairro] = useState('');
  const [editCidade, setEditCidade] = useState('');
  const [editEstado, setEditEstado] = useState('');

  // Inicializa o banco
  useEffect(() => {
    (async () => {
      const rbd = await Banco();
      await createTable(rbd);
      setDb(rbd);
      const lista = await selectUsuarios(rbd);
      console.log('Usuários iniciais:', lista);
      setUsuarios(lista);
    })();
  }, []);

  // Recarrega usuários quando o db muda
  useEffect(() => {
    if (db) {
      carregarUsuarios();
    }
  }, [db, carregarUsuarios]);

  // Carrega usuários
  const carregarUsuarios = useCallback(async () => {
    if (!db) return;
    try {
      const lista = await selectUsuarios(db);
      console.log('Usuários carregados:', lista);
      setUsuarios(lista);
    } catch (error) {
      console.log('Erro ao carregar usuários:', error);
    }
  }, [db]);

  // Busca CEP automaticamente 
  const handleCepChange = async (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, '');
    setCep(apenasNumeros);

    if (apenasNumeros.length === 8) {
      setBuscandoCep(true);
      const endereco = await buscarCep(apenasNumeros);
      setBuscandoCep(false);

      if (endereco) {
        setLogradouro(endereco.logradouro);
        setBairro(endereco.bairro);
        setCidade(endereco.cidade);
        setEstado(endereco.estado);
      } else {
        Alert.alert('Erro', 'CEP não encontrado.');
        setLogradouro('');
        setBairro('');
        setCidade('');
        setEstado('');
      }
    } else {
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
    }
  };

  // Cadastrar usuário
  const handleCadastrar = async () => {
    if (!db) return;
    if (!nome.trim() || !email.trim() || !cep.trim()) {
      Alert.alert('Atenção', 'Preencha nome, email e CEP.');
      return;
    }
    try {
      await inserirUsuario(db, nome, email, cep, logradouro, numero, complemento, bairro, cidade, estado);
      console.log('Usuário inserido com sucesso');
      
      // Limpa o formulário
      setNome('');
      setEmail('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
      
      // Aguarda um pouco e recarrega a lista
      setTimeout(async () => {
        await carregarUsuarios();
        Alert.alert('Sucesso', 'Usuário cadastrado!');
      }, 300);
    } catch (error) {
      console.log('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Erro ao cadastrar usuário.');
    }
  };

  // Abre o modal de confirmação
  const handleDeletar = (id: number) => {
    setIdParaDeletar(id);
    setModalVisivel(true);
  };

  // Confirma e executa a exclusão
  const confirmarExclusao = async () => {
    if (!db || idParaDeletar === null) return;
    try {
      await deletaUsuario(db, idParaDeletar);
      console.log('Usuário deletado com sucesso');
      setModalVisivel(false);
      setIdParaDeletar(null);
      
      // Aguarda um pouco e recarrega a lista
      setTimeout(async () => {
        await carregarUsuarios();
        Alert.alert('Sucesso', 'Usuário deletado!');
      }, 300);
    } catch (error) {
      console.log('Erro ao deletar:', error);
      Alert.alert('Erro', 'Erro ao deletar usuário.');
    }
  };

  // Cancela e fecha o modal
  const cancelarExclusao = () => {
    setModalVisivel(false);
    setIdParaDeletar(null);
  };

  // Abre o modal de edição
  const handleEditar = (usuario: Usuario) => {
    setIdParaEditar(usuario.ID_US);
    setEditNome(usuario.NOME_US);
    setEditEmail(usuario.EMAIL_US);
    setEditCep(usuario.CEP_US);
    setEditLogradouro(usuario.LOGRADOURO_US);
    setEditNumero(usuario.NUMERO_US);
    setEditComplemento(usuario.COMPLEMENTO_US);
    setEditBairro(usuario.BAIRRO_US);
    setEditCidade(usuario.CIDADE_US);
    setEditEstado(usuario.ESTADO_US);
    setModalEdicaoVisivel(true);
  };

  // Salva a edição
  const handleSalvarEdicao = async () => {
    if (!db || idParaEditar === null) return;
    if (!editNome.trim() || !editEmail.trim() || !editCep.trim()) {
      Alert.alert('Atenção', 'Preencha nome, email e CEP.');
      return;
    }
    try {
      await atualizarUsuario(db, idParaEditar, editNome, editEmail, editCep, editLogradouro, editNumero, editComplemento, editBairro, editCidade, editEstado);
      console.log('Usuário atualizado com sucesso');
      setModalEdicaoVisivel(false);
      setIdParaEditar(null);
      
      // Aguarda um pouco e recarrega a lista
      setTimeout(async () => {
        await carregarUsuarios();
        Alert.alert('Sucesso', 'Usuário atualizado!');
      }, 300);
    } catch (error) {
      console.log('Erro ao atualizar:', error);
      Alert.alert('Erro', 'Erro ao atualizar usuário.');
    }
  };

  // Cancela edição
  const cancelarEdicao = () => {
    setModalEdicaoVisivel(false);
    setIdParaEditar(null);
  };

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <View style={styles.cardAcento} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{item.NOME_US}</Text>
        <Text style={styles.cardTexto}>{item.EMAIL_US}</Text>
        <Text style={styles.cardTexto}>
          {item.LOGRADOURO_US}{item.NUMERO_US ? `, ${item.NUMERO_US}` : ''}{item.COMPLEMENTO_US ? ` (${item.COMPLEMENTO_US})` : ''}
        </Text>
        <Text style={styles.cardTexto}>
          {item.BAIRRO_US ? `${item.BAIRRO_US}, ` : ''}{item.CIDADE_US}{item.ESTADO_US ? ` - ${item.ESTADO_US}` : ''} | CEP: {item.CEP_US}
        </Text>
      </View>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => handleEditar(item)}>
          <Text style={styles.btnEditarTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDeletar} onPress={() => handleDeletar(item.ID_US)}>
          <Text style={styles.btnDeletarTexto}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={cancelarExclusao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIconTexto}>🗑️</Text>
            </View>
            <Text style={styles.modalTitulo}>Excluir usuário</Text>
            <Text style={styles.modalMensagem}>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.btnCancelar} onPress={cancelarExclusao}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmarExcluir} onPress={confirmarExclusao}>
                <Text style={styles.btnConfirmarExcluirTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de edição */}
      <Modal
        visible={modalEdicaoVisivel}
        transparent
        animationType="slide"
        onRequestClose={cancelarEdicao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalEditBox}>
            <ScrollView>
              <Text style={styles.modalEditTitulo}>Editar Usuário</Text>

              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#9CA3AF"
                value={editNome}
                onChangeText={setEditNome}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>CEP</Text>
              <TextInput
                style={styles.input}
                placeholder="CEP"
                placeholderTextColor="#9CA3AF"
                value={editCep}
                onChangeText={setEditCep}
                keyboardType="numeric"
                maxLength={8}
              />

              <Text style={styles.label}>Logradouro</Text>
              <TextInput
                style={styles.input}
                placeholder="Logradouro"
                placeholderTextColor="#9CA3AF"
                value={editLogradouro}
                onChangeText={setEditLogradouro}
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Número</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Número"
                    placeholderTextColor="#9CA3AF"
                    value={editNumero}
                    onChangeText={setEditNumero}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Complemento</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Complemento"
                    placeholderTextColor="#9CA3AF"
                    value={editComplemento}
                    onChangeText={setEditComplemento}
                  />
                </View>
              </View>

              <Text style={styles.label}>Bairro</Text>
              <TextInput
                style={styles.input}
                placeholder="Bairro"
                placeholderTextColor="#9CA3AF"
                value={editBairro}
                onChangeText={setEditBairro}
              />

              <View style={styles.rowContainer}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Cidade</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade"
                    placeholderTextColor="#9CA3AF"
                    value={editCidade}
                    onChangeText={setEditCidade}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Estado</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="UF"
                    placeholderTextColor="#9CA3AF"
                    value={editEstado}
                    onChangeText={setEditEstado}
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.modalEditBotoes}>
                <TouchableOpacity style={styles.btnCancelar} onPress={cancelarEdicao}>
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSalvarEdicao} onPress={handleSalvarEdicao}>
                  <Text style={styles.btnSalvarEdicaoTexto}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <View style={[styles.headerInner, contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%' } : {}]}>
          <Text style={styles.headerTexto}>Cadastro de Usuários</Text>
          <Text style={styles.headerSub}>Preencha os dados e pesquise pelo CEP</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.innerContent, contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' } : {}]}>

          {/* Formulário */}
          <View style={styles.form}>
            <Text style={styles.formTitulo}>Novo Cadastro</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>CEP</Text>
            <View style={styles.cepRow}>
              <TextInput
                style={[styles.input, styles.cepInput]}
                placeholder="Somente números"
                placeholderTextColor="#9CA3AF"
                value={cep}
                onChangeText={handleCepChange}
                keyboardType="numeric"
                maxLength={8}
              />
              {buscandoCep && (
                <ActivityIndicator size="small" color="#7C3AED" style={{ marginLeft: 10 }} />
              )}
            </View>

            {logradouro !== '' && (
              <View style={styles.enderecoBox}>
                <Text style={styles.enderecoTitulo}>📍 Endereço encontrado (edite se necessário)</Text>

                <Text style={styles.label}>Logradouro</Text>
                <TextInput
                  style={styles.input}
                  value={logradouro}
                  onChangeText={setLogradouro}
                  placeholder="Logradouro"
                  placeholderTextColor="#9CA3AF"
                />

                <View style={styles.rowContainer}>
                  <View style={styles.halfInput}>
                    <Text style={styles.label}>Número</Text>
                    <TextInput
                      style={styles.input}
                      value={numero}
                      onChangeText={setNumero}
                      placeholder="Número"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.label}>Complemento</Text>
                    <TextInput
                      style={styles.input}
                      value={complemento}
                      onChangeText={setComplemento}
                      placeholder="Apto, sala, etc"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <Text style={styles.label}>Bairro</Text>
                <TextInput
                  style={styles.input}
                  value={bairro}
                  onChangeText={setBairro}
                  placeholder="Bairro"
                  placeholderTextColor="#9CA3AF"
                />

                <View style={styles.rowContainer}>
                  <View style={styles.halfInput}>
                    <Text style={styles.label}>Cidade</Text>
                    <TextInput
                      style={styles.input}
                      value={cidade}
                      onChangeText={setCidade}
                      placeholder="Cidade"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Text style={styles.label}>Estado</Text>
                    <TextInput
                      style={styles.input}
                      value={estado}
                      onChangeText={setEstado}
                      placeholder="UF"
                      placeholderTextColor="#9CA3AF"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastrar}>
              <Text style={styles.btnCadastrarTexto}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de Usuários */}
          <View style={styles.listaHeader}>
            <Text style={styles.listaTitulo}>Usuários Cadastrados</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{usuarios.length}</Text>
            </View>
          </View>

          {usuarios.length === 0 ? (
            <Text style={styles.listaVazia}>Nenhum usuário cadastrado ainda.</Text>
          ) : (
            usuarios.map((item) => (
              <View key={item.ID_US}>
                {renderUsuario({ item })}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  
  // Layout principal 
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF', 
  },

  // Header 
  header: {
    backgroundColor: '#5B21B6', 
    paddingTop: Platform.OS === 'web' ? 24 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  headerInner: {
    alignItems: 'center',
  },
  headerTexto: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: '#DDD6FE', 
    fontSize: 13,
    marginTop: 4,
  },

  // Scroll View
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
  },

  // Formulário 
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EDE9FE', 
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151', 
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#C4B5FD', 
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#111827', 
    backgroundColor: '#FAFAFF',
  },
  cepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cepInput: {
    flex: 1,
  },

  // Container lado a lado 
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  halfInput: {
    flex: 1,
  },

  // Box endereço 
  enderecoBox: {
    backgroundColor: '#EDE9FE', 
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED', 
  },
  enderecoTitulo: {
    fontWeight: '700',
    fontSize: 13,
    color: '#5B21B6',
    marginBottom: 12,
  },
  enderecoTexto: {
    color: '#374151',
    fontSize: 13,
    lineHeight: 20,
  },

  // Botão Cadastrar 
  btnCadastrar: {
    backgroundColor: '#7C3AED', 
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  btnCadastrarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Lista
  listaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  listaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F', 
  },
  badge: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listaVazia: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 24,
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAcento: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: '#A78BFA', 
    borderRadius: 4,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardTexto: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },

  // Botões do Card
  cardButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
  },
  btnEditar: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnEditarTexto: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Botão Deletar
  btnDeletar: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDeletarTexto: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Modal de confirmação 
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 0, 60, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  modalIconWrap: {
    backgroundColor: '#EDE9FE',
    borderRadius: 40,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconTexto: {
    fontSize: 26,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 10,
  },
  modalMensagem: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancelar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnCancelarTexto: {
    color: '#5B21B6',
    fontSize: 14,
    fontWeight: '600',
  },
  btnConfirmarExcluir: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnConfirmarExcluirTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal de edição
  modalEditBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxHeight: '85%',
    marginTop: 'auto',
    marginBottom: 0,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  modalEditTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingBottom: 12,
  },
  modalEditBotoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  btnSalvarEdicao: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  btnSalvarEdicaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
