async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
}

async function loadContract() {
  return await new window.web3.eth.Contract(
    [
      {
        "constant": false,
        "inputs": [
          {
            "name": "delegate",
            "type": "address"
          },
          {
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "buyer",
            "type": "address"
          },
          {
            "name": "numTokens",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "total",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "tokenOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokens",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "owner",
            "type": "address"
          },
          {
            "name": "delegate",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "tokenOwner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "0x547Ce04e92817c5647F96f8d3bF1Ca2AdF7BFaC6"
  );
}

const wallets = [
  '0x8178f86e231e4C01cC796f6Bc02361e64f96Cafe',
  '0x274c5db131BbE3555b2C95d85d93A56C21fA37ed'
]

async function printName() {
  const name = await window.contract.methods.name().call();
  updateStatus(name, '#name');
}

async function printSymbol() {
  const symbol = await window.contract.methods.symbol().call();
  updateStatus(symbol, '#symbol');
}

async function printTotalSupply() {
  const totalSupply = await window.contract.methods.totalSupply().call();
  updateStatus(totalSupply, '#total');
}

async function transferFrom(from, to, amount) {
  await window.contract.methods.transfer(to, amount).send({ from });
}

function handleModalOpen(wallet) {
  window.target = wallet;
  $('#amountHelp').html(`Money will be wired to <code>${wallet}</code>`)
  web3.eth.getAccounts((err, walletList) => {
    $('#targetWallet').html(walletList.map(w => `<option value="${w}">${w}</option>`));
  });
}

async function printUsers() {
  $('#wallets').empty();
  return await wallets.forEach(async (wallet, id) => {
    updateStatus('Loading wallets...');
    const balance = await window.contract.methods.balanceOf(wallet).call();
    const card = $(`
      <div class="col-12 col-md-6">
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">Wallet ${id + 1}</h5>
                  <pre class="mb-2 text-muted">${wallet}</pre>
                  <p class="card-text">Balance: ${balance}</p>
                  <a href="#" class="btn btn-primary" data-toggle="modal" 
                    data-target="#transferModal" 
                    onclick="handleModalOpen('${wallet}')"
                  >
                    Transfer to this wallet
                  </a>
              </div>
          </div>
      </div>
    `);
    $('#wallets').append(card);
    updateStatus('Ready for new requests');
  })
}

async function handleSubmit() {
  $('#transferBtn').html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  `)
  const result = await transferFrom($('#targetWallet').val(), window.target, +$('#amount').val());
  console.log(result);
  await printUsers();
  $('#transferBtn').html('Transfer');
  $('#transferModal').modal('hide');
}


async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}

async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  updateStatus("Ready!");
  await printName();
  await printSymbol();
  await printTotalSupply();
  await printUsers();
}

function updateStatus(status, selector = '#output') {
  const statusEl = document.querySelector(selector);
  statusEl.innerHTML = status;
  console.log(status);
}

load();
