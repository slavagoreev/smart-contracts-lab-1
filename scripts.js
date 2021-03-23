//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function computeDistance(lat1, lon1, lat2, lon2, unit = "M") {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    if (unit === "M") {
      dist = dist * 1.609344 * 1000;
    }
    return dist;
  }
}

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
        constant: false,
        inputs: [
          {
            name: "distance",
            type: "uint256",
          },
        ],
        name: "requestTokens",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "receiver",
            type: "address",
          },
          {
            name: "numTokens",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: true,
        stateMutability: "payable",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "withdraw",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            name: "_name",
            type: "string",
          },
          {
            name: "_symbol",
            type: "string",
          },
          {
            name: "total",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "tokenOwner",
            type: "address",
          },
          {
            indexed: true,
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            name: "tokens",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            name: "tokens",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            name: "tokens",
            type: "uint256",
          },
        ],
        name: "Granted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            name: "fee",
            type: "uint256",
          },
        ],
        name: "Withdraw",
        type: "event",
      },
      {
        constant: true,
        inputs: [
          {
            name: "tokenOwner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
          {
            name: "",
            type: "uint8",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "faucetSupply",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "fee",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "minimalDistance",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    "0xB969a95C719bc5d0651E5f2c420aD8ee6D88C203"
  );
}

async function requestTokens(distance) {
  await window.contract.methods
    .requestTokens(distance)
    .send({ from: await getCurrentAccount() });
}

async function checkBalance() {
  updateStatus("Loading...");
  const from = await getCurrentAccount();
  const response = await window.contract.methods.balanceOf(from).call();
  updateStatus(`Current balance is ${response}SCT`);
}

async function handleLocationCheck(pretendLikeIAmInSC = false) {
  $(!pretendLikeIAmInSC ? "#check-location" : "#pretend").html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  `);
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat = !pretendLikeIAmInSC ? position.coords.latitude : 55.751244;
    let long = !pretendLikeIAmInSC ? position.coords.longitude : 48.74225;

    const distance = computeDistance(lat, long, 55.7512495, 48.7422761).toFixed(
      0
    );
    updateStatus(
      `Your location is ${lat},${long} is ${distance} meters far from 55.7512495,48.7422761`
    );
    try {
      await requestTokens(distance);
      alert(`Your location successfully sent`);
    } catch (e) {
      console.error(e);
      alert(`You are far away from Sport complex`);
    } finally {
      if (!pretendLikeIAmInSC) {
        $("#pretend").html(`Fake location and check`);
      } else {
        $("#check-location").html(`Check my location`);
      }
      await checkBalance();
    }
  });
}

async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}

async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  await checkBalance();
}

function updateStatus(status, selector = "#output") {
  const statusEl = document.querySelector(selector);
  statusEl.innerHTML = status;
  console.log(status);
}

load();
