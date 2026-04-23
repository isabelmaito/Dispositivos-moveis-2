let express = require('express');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');
let methodOvirride = require('method-override');
let cors = require('cors');

let app = express();

//Vincule middlewares
app.use(cors());

// Permite que você use verbos HTTP
app.use(methodOvirride('X-HTTP-Method'));
app.use(methodOvirride('X-HTTP-Method-Override'));
app.use(methodOvirride('X-Method-Override'));
app.use(methodOvirride('_method'));

app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", "*");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


//get
app.get('/', async (req, res) => {
    // fazer consulta no mongodb para exibir os documentos(registro)
    const documentos = await Usuario.find({}); 
    res.json(documentos);
})

//post
app.post('/add', async (req, res) => {
    let nome = req.body.name;
    const rec = new Usuario({name: nome});
    rec.save();
    res.json({'status' : 'Adicionado' });    
})

//put
app.put('/:id', (req, res) => {
    let i = req.params.id;
    res.send(`Comando de Atualizar ${i}`);
})

//delete
app.delete('/:id', async (req, res) => {
    let id = req.params.id;
    await Usuario.deleteOne({_id: i});
    res.send(`Comando de Deletar ${i}`);
})

//iniciar o srvidor
app.listen( 3000, () => {
    console.log('Executando o Servidor')
});


