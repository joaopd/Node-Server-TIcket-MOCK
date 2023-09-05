const http = require('http');
const jwt = require('jsonwebtoken');
const inserirPin = require('./corrigir.js');
const { Console } = require('console');
const url = require('url');
const secretKey = '59:26:8F:AD:37:BF:D2:EC';
const tickets = [
  {
    ticket: "1234",
    number: 1,
    code: "A",
    label: "A0001",
    service: "092a6f30-9a24-416f-8d48-800be5c31d63",
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  },
  {
    ticket: "72",
    number: 1,
    code: "A",
    label: "A0001",
    service: "092a6f30-9a24-416f-8d48-800be5c31d63",
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  },
  {
    ticket: "73",
    number: 1,
    code: "A",
    label: "A0001",
    service: "092a6f30-9a24-416f-8d48-800be5c31d63",
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  },
  {
    ticket: "54323",
    number: 1,
    code: "A",
    label: "A0001",
    service: "092a6f30-9a24-416f-8d48-800be5c31d63",
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  },
];
const instances = [
  {
    "id": "CNSB",
    "description": "Clínica CUF Nova SBE"
  },
  {
    "id": "CMFL",
    "description": "Clínica CUF Miraflores"
  },
  {
    "id": "CLAL",
    "description": "Clínica CUF Dr. Luís Alvares"
  },
  {
    "id": "CALM",
    "description": "Clínica CUF Almada"
  },
  {
    "id": "CALV",
    "description": "Clínica CUF Alvalade"
  },
  {
    "id": "CMFR",
    "description": "Clínica CUF Mafra"
  },
  {
    "id": "CMTJ",
    "description": "Clínica CUF Montijo"
  },
  {
    "id": "CSDR",
    "description": "Clínica CUF São Domingos de Rana"
  },
  {
    "id": "CSJM",
    "description": "Clínica CUF São João da Madeira"
  },
  {
    "id": "HCSC",
    "description": "Hospital CUF Cascais"
  },
  {
    "id": "HCBR",
    "description": "Hospital CUF Coimbra"
  },
  {
    "id": "HDSC",
    "description": "Hospital CUF Descobertas"
  },
  {
    "id": "HTRD",
    "description": "Hospital CUF Trindade"
  },
  {
    "id": "HPRT",
    "description": "Hospital CUF Porto"
  },
  {
    "id": "HSTR",
    "description": "Hospital CUF Santarém"
  },
  {
    "id": "HSNT",
    "description": "Hospital CUF Sintra"
  },
  {
    "id": "HTJO",
    "description": "Hospital CUF Tejo"
  },
  {
    "id": "HTVD",
    "description": "Hospital CUF Torres Vedras"
  },
  {
    "id": "HVIS",
    "description": "Hospital CUF Viseu"
  },
  {
    "id": "CINS",
    "description": "Instituto CUF Porto"
  },
  {
    "id": "CLRA",
    "description": "Clínica CUF Leiria"
  },
  {
    "id": "CBLM",
    "description": "Clínica CUF Belém"
  }]
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    if (req.url === '/api/login') {
      handleLoginRequest(req, res);
    } else if (req.url === '/tickets/$call-next') {
      handleCallNextRequest(req, res);
    } else if (req.url === '/tickets/$call') {
      handleCallRequest(req, res);
    } else if (req.url === '/tickets/$end-call') {
      handleEndCallRequest(req, res);
    } else if (req.url === '/tickets/$recall') {
      handleRecallRequest(req, res);
    }
    else if (req.url === '/tickets/$create') {
      handleCreateTicketRequest(req, res);
    } 
  }
  else if (req.method === 'GET') {
    if (req.url === '/instances') {
      if (!handleAuthorization(req, res)) return;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(instances));
    }
    else if (req.url === '/zones?instance=CJMS') {
      handleGetZonesRequest(req, res);
    }
    else if (req.url === '/tickets?service=1') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(tickets));
    }
    else if (req.url === '/services?instance=CNSB') {
      if (!handleAuthorization(req, res)) return;
      const services = 
      [
          {
              "id": "e306ec90-e7d2-44e2-96d0-274dc8a33ce1",
              "description": "Atendimento geral",
              "code": "A",
              "zone": "1",
              "zoneDescription": "CCSJM - Recepção Principal",
              "queuedTickets": 0,
              "instance": "CSJM"
          },
          {
              "id": "e306ec90-e7d2-44e2-96d0-274dc8a33ce1",
              "description": "Levantamento Exames",
              "code": "B",
              "zone": "1",
              "zoneDescription": "CCSJM - Recepção Principal",
              "queuedTickets": 0,
              "instance": "CSJM"
          },
          {
              "id": "e306ec90-e7d2-44e2-96d0-274dc8a33ce1",
              "description": "Pagamentos e Marcações",
              "code": "C",
              "zone": "1",
              "zoneDescription": "CCSJM - Recepção Principal",
              "queuedTickets": 0,
              "instance": "CSJM"
          }
      ]
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(services));
    }
    else if (req.url === '/counters?instance=CMFL') {
      if (!handleAuthorization(req, res)) return;
      const filteredZones = [
        {
          "id": "43867be2-f8bc-4fe8-9efc-d4befd03fa89",
          "description": "Gab 28 RX",
          "code": "M214",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "ee37fc34-1d4c-46cf-aa4f-3c5a0cc7e641",
          "description": "Gab 29 ECO",
          "code": "M215",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "8d32ff80-c2f2-4733-a0b4-7d8e7934d156",
          "description": "Gabinete 30 ECO",
          "code": "M216",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "d1ff4092-1c8e-428a-ab3f-6317cf0347e3",
          "description": "Balcão 1",
          "code": "CCMF1REC01",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "b6996bd0-1a3b-4c9a-8060-2f2645472438",
          "description": "Balcão 2",
          "code": "CCMF1REC02",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "6dec662c-ec98-46f0-a59b-9b2038dd4664",
          "description": "Balcão 3",
          "code": "CCMF1REC03",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "21868791-b9a6-4dc4-a7d7-0730a22dec06",
          "description": "Balcão 4",
          "code": "CCMF1REC04",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "b74e7540-0794-483b-8a62-4839cab9a408",
          "description": "Balcão 5",
          "code": "CCMF1REC05",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "6739652c-4a19-43b3-a1f7-f4ea874fdbb2",
          "description": "Balcão 6",
          "code": "CCMF1REC06",
          "zone": 5,
          "zoneDescription": "Receção - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "7e955c02-ef07-4f9d-8cd2-5507a950d3bc",
          "description": "Gabinete 1",
          "code": "M101",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "7b345ab5-3a14-404f-ba8b-19700034ed1c",
          "description": "Gabinete 2",
          "code": "M102",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "982cb618-eb36-43ba-bb3d-c2f7fa20c4e9",
          "description": "Gabinete 3",
          "code": "M103",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "57a3c513-42a8-4693-9a5c-86e6a6445988",
          "description": "Gabinete 4",
          "code": "M104",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "9fa5c175-9bc3-4cc5-a270-989440fe1497",
          "description": "Gabinete 5",
          "code": "M105",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "e053721b-938e-4a87-a637-c75b0a38ae1e",
          "description": "Gabinete 6",
          "code": "M106",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "8a648076-e861-4583-ac82-ffaed492d1f0",
          "description": "Gabinete 7",
          "code": "M107",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "92c4a346-4766-4e43-83de-2f52ca2be2e4",
          "description": "Gabinete 8",
          "code": "M108",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "7f15bb74-7243-40c6-89a4-a8fc2f13b952",
          "description": "Gabinete 9",
          "code": "M109",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "00ee155c-36d5-4ba6-93fe-5a61d1d8267f",
          "description": "Gabinete 10",
          "code": "M110",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "05ee1fc5-cc07-4f86-836d-c697c6139ff8",
          "description": "Gabinete 11",
          "code": "M111",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "dc064c06-3989-47a1-b1f7-91d1bfd1268c",
          "description": "Gabinete 12",
          "code": "M112",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "560749e5-855d-4b1e-89ef-7af924eeb7b4",
          "description": "Gabinete 13",
          "code": "M113",
          "zone": 6,
          "zoneDescription": "Gabinetes - Piso 1",
          "instance": "CMFL"
        },
        {
          "id": "3cb7ca04-345f-4e73-a108-2ab61a23aaee",
          "description": "Gabinete 14",
          "code": "M201",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "c98ab8d2-5f56-4363-86a2-0850cc61dbe1",
          "description": "Gabinete 15",
          "code": "M202",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "7f0d8cc5-ed74-4082-beb5-952e64025d3f",
          "description": "Gabinete 16",
          "code": "M203",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "a695cacc-ce4e-4728-b3bd-d4ab1eba6839",
          "description": "Gabinete 18",
          "code": "M204",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "16074287-4281-445b-991a-8abbdb97a842",
          "description": "Gabinete 19",
          "code": "M205",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "9debd923-e8c2-4e3d-814a-beba7759aa8c",
          "description": "Gabinete 20",
          "code": "M206",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "b3a4ee11-0181-4d9b-b190-b0f065ee39bf",
          "description": "Gabinete 17",
          "code": "M207",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "b0433286-064f-4626-8e42-ef30e53e7f00",
          "description": "Gabinete 21",
          "code": "M208",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "ee71d463-4be4-43d8-9028-f18862b8cf17",
          "description": "Gabinete 22",
          "code": "M209",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "8b5c98a0-ab0c-4c6c-86f0-7f6ee10529af",
          "description": "Gabinete 23",
          "code": "M210",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "af8b177d-c768-460f-931f-e0698774998c",
          "description": "Gabinete 24",
          "code": "M211",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "3b24a5a6-5ea5-4f86-8d33-b61d7a62beed",
          "description": "Gabinete 25",
          "code": "M212",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "d288fce8-24c3-40ca-8955-05a3cf78fbff",
          "description": "Gab 27 TAC",
          "code": "M213",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        },
        {
          "id": "5ea63f5a-8bc7-4734-80a6-e3d308e88fd7",
          "description": "Gab Mamografia",
          "code": "M217",
          "zone": 7,
          "zoneDescription": "Gabinetes - Piso 2",
          "instance": "CMFL"
        }
      ]

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(filteredZones));
    }
    else {
      handleNotFound(req, res);
    }
  }
  else {
    handleNotFound(req, res);
  }
});

function handleNotFound(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

function handleAuthorization(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return false;
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return false;
  }
}

function parseRequestBody(req, callback) {
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', () => {
    callback(requestBody);
  });
}

function handleLoginRequest(req, res) {
  parseRequestBody(req, (requestBody) => {
    const credentials = JSON.parse(requestBody);
    
    if (credentials.username === 'TESTE' && credentials.password === 'TESTE') {
      const token = jwt.sign({}, secretKey, { expiresIn: '1h' });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ token: token }));
    } else {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }
  });
}

function handleCallNextRequest(req, res) {
  if (!handleAuthorization(req, res)) return;

  parseRequestBody(req, (requestBody) => {
    const jsonData = JSON.parse(requestBody);
    const { counter, user } = jsonData;
    if (!validateParameters(counter, user)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing parameters: counter or user' }));
    } else {
      getNextTicket(res);
    }
  });
}

function handleCallRequest(req, res) {
  if (!handleAuthorization(req, res)) return;

  parseRequestBody(req, (requestBody) => {
    const jsonData = JSON.parse(requestBody);
    const { counter, user, ticket } = jsonData;
    getTicket(req, res,ticket);
  });
}

function handleEndCallRequest(req, res) {
  if (!handleAuthorization(req, res)) return;

  parseRequestBody(req, (requestBody) => {
    const jsonData = JSON.parse(requestBody);
    const { counter, user, ticket } = jsonData;
    endTicket(req, res,ticket);
  });
}

function handleRecallRequest(req, res) {
  if (!handleAuthorization(req, res)) return;

  parseRequestBody(req, (requestBody) => {
    const jsonData = JSON.parse(requestBody);
    const { counter, user, ticket } = jsonData;
    getTicket(req, res,ticket);
  });
}

function handleCreateTicketRequest(req, res) {
  if (!handleAuthorization(req, res)) return;

  parseRequestBody(req, (requestBody) => {
    const jsonData = JSON.parse(requestBody);
    const { counter, user, service } = jsonData;
    createTicket(req, res,service);
  });
}

function validateParameters(counter, user) {
  return counter && user;
}

function getNextTicket(res) {
  const response = {
    ticket: "123",
    number: 1,
    code: "A",
    label: "A0001",
    service: "092a6f30-9a24-416f-8d48-800be5c31d63",
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
}

function getTicket(req, res, ticketId) {
  
  console.log(ticketId);
  const ticket = tickets.find(t => t.ticket === ticketId.toString());

  if (ticket) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ticket));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Ticket not found' }));
  }
}

function createTicket(req, res, service) {
  if (!service) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing parameter: service' }));
    return;
  }
  const newTicket = {
    ticket: "1234",
    number: 1,
    code: "A",
    label: "A0001",
    service: service,
    serviceDescription: "Atendimento Geral",
    instance: "CMFL",
    priority: 0
  }

  if (newTicket) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newTicket));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Ticket not found' }));
  }
}
function endTicket(req, res, ticketId) {
  
  console.log(ticketId);
  const ticket = tickets.find(t => t.ticket === ticketId.toString());
  const newTicket = { ticket: ticketId.toString()};
  if (ticket) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(newTicket));
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Ticket not found' }));
  }
}
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
