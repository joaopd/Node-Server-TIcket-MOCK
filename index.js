const http = require('http');
const jwt = require('jsonwebtoken');
const inserirPin = require('./corrigir.js');
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
    } else if (req.url === '/tickets/$create') {
      handleCreateTicketRequest(req, res);
    } 
    else {
      handleNotFound(req, res);
    }
  } else {
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
