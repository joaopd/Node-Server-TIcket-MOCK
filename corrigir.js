
//servico
function inserirPin(nome, pin, email) {
    if((nome =="" || pin == ""|| email =="")) {
        console.error("Preencha todos os campos!");
        return false
    }

    if (!existeUsuario(email)) {
        console.error("Usuario nao existe!");
        return false
    }

    if(verificarPin(pin, email)){
        console.error("Pin ja existe!");
        return false
    }

    if(!inserirPinNoBD(pin, email, nome)){
        console.error("Erro ao inserir pin no banco de dados!");
        return false
    }

    console.log("Pin inserido com sucesso!");
    return true
}


//banco de dados
function existeUsuario(email) {
    //consultar banco de dados
    console.log("indo ao banco de dados verificar se o usuario existe");
    return true;
}

function verificarPin(pin, email) {
    //consultar banco de dados
    console.log("indo ao banco de dados verificar se o pin existe");
    return false;
}

function inserirPinNoBD(pin, email, nome) {
    //consultar banco de dados
    console.log("inserindo pin no banco de dados");
    return true;
}

