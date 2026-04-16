let express = require('express');
const mongoose = require('mongoose');

// caminho do mongoo
let url = 'mongodb://localhost:27017/DSM_2026';

mongoose.connect(url)
.then(
    () => {
        console.log('Conexão com o MongoDB estabelecida com Sucesso')}
    ).catch(
        (err) => {
            console.log(err)
        }   
)

// estrutura coleção, documento(agregado)
const Usuario = mongoose.model('Usuario', mongoose.Schema({
    name: String
}));



//referencia

let app = express();

//get
app.get('/',(req, res) => {
    res.send('Comando de Exibir');
})

//post
app.post('/add',(req, res) => {
    // let i = req.body.name,
    res.send(`Comando de Adicionar ${i}`);
})

//put
app.put('/:id', (req, res) => {
    let i = req.params.id;
    res.send(`Comando de Atualizar ${i}`);
})

//delete
app.delete('/:id', (req, res) => {
    let i = req.params.id;
    res.send(`Comando de Deletar ${i}`);
})

//iniciar o srvidor
app.listen( 3000, () => {
    console.log('Executando o Servidor')
});
