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
        inputs: [
          {
            internalType: "string",
            name: "question",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "answers",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "correct_answer_index",
            type: "uint256",
          },
        ],
        name: "addQuestion",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "question_id",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "correct_index",
            type: "uint256",
          },
        ],
        name: "answerQuestion",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getQuestions",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "question",
                type: "string",
              },
              {
                internalType: "string[]",
                name: "answers",
                type: "string[]",
              },
              {
                internalType: "uint256",
                name: "reward",
                type: "uint256",
              },
            ],
            internalType: "struct Questionnaire.Question[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    "0x99adeebedcd951fc7dd455f625a204215e7b9532"
  );
}

async function createQuestion(question, answers, correctAnswer, reward, from) {
  await window.contract.methods
    .addQuestion(question, answers.toArray(), correctAnswer)
    .send({ from, value: Web3.utils.toWei(reward) });
}

async function answerQuestion(questionId, answerId) {
  console.log({ questionId, answerId });
  return await window.contract.methods
    .answerQuestion(questionId, answerId)
    .send({ from: await getCurrentAccount() });
}

async function fetchQuestions() {
  $("#questions").empty();
  updateStatus("Loading questions...");
  const questions = await window.contract.methods.getQuestions().call();
  questions.forEach((question, id) => {
    const card = $(`
      <div class="col-12 col-md-6">
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">Question ${id + 1}</h5>
                  <pre class="mb-2 text-muted">Reward: ${Web3.utils.fromWei(
                    String(question.reward)
                  )} ETH</pre>
                  <p class="card-text"><strong>${question.question}</strong></p>
                  <form onsubmit='handleAnswer('${question.id}')">
                    ${question.answers
                      .map(
                        (answer, answerId) => `
                      <div class="form-check">
                        <input class="form-check-input" type="radio" data-id="${answerId}" name="answer_${question.id}" id="answer_${question.id}_${answerId}" value="${answerId}">
                        <label class="form-check-label" for="answer_${question.id}_${answerId}">
                          ${answer}
                        </label>
                      </div>
                    `
                      )
                      .join("")}
                    <button type="submit" class="btn btn-primary btn-sm mt-2" id="submit_${
                      question.id
                    }" onclick="event.preventDefault(); handleAnswer('${
      question.id
    }')">Answer</button>    
                  </form>              
              </div>
          </div>
      </div>
    `);
    $("#questions").append(card);
  });
  updateStatus("Ready for new requests");
}

async function handleSubmit() {
  $("#submitBtn").html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  `);
  const accountId = await getCurrentAccount();
  await createQuestion(
    $("#title").val(),
    $('[id^="answer_input_"]').map((id, el) => $(el).val()),
    +$("#correctAnswer").val(),
    $("#reward").val(),
    accountId
  );
  $("#submitBtn").html("Ask a question");
  await fetchQuestions();
}

async function handleAnswer(questionId) {
  const btn = $("#submit_" + questionId);
  const answer = $(`[name="answer_${questionId}"]:checked`);
  btn.html(`
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Sending...
  `);
  if (answer) {
    try {
      await answerQuestion(questionId, +answer.data("id"));
      alert("Cool, you are right");
      await fetchQuestions();
    } catch (e) {
      alert("Wrong answer!");
      console.log(e.message);
    }
  } else {
    alert("Please, select an answer");
  }
  btn.html("Answer");
}

async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}

async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  await fetchQuestions();
  updateStatus("Ready!");
}

function updateStatus(status, selector = "#output") {
  const statusEl = document.querySelector(selector);
  statusEl.innerHTML = status;
  console.log(status);
}

load();
