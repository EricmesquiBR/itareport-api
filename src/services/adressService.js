const prismaClient = require("../db/prismaClient");

async function insertAdress(rua, bairro, cidade) {

    const adress = await prismaClient.Endereco.create({
      data: {street: rua,
             district: bairro,
             city: cidade, 
             lat: 0,
             lon: 0  },
    });
  
    return adress.id_adress;
  }

module.exports = {
    insertAdress,
}