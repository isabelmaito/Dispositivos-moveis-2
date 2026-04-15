let express = require('express');

//referencia

let app = express();

//get
app.get('/',(req, res) => {
    res.send('Comando de Exibir');
})

//post
app.post('/add',(req, res) => {
    res.send('Comando de Adicionar');
})

//iniciar o srvidor
app.listen( 3000, () => {
    console.log('Executando o Servidor')
});
