pragma solidity 0.7.5;
pragma abicoder v2;

contract Questionnaire {
    struct Question {
        bytes32 id;
        string question;
        string[] answers;
        uint256 reward;
    }
    
    Question[] private questions;
    
    mapping (bytes32 => uint256) private id_to_index;
    mapping(bytes32 => uint256) private id_to_answer;
    
    function getQuestions() external view returns (Question[] memory) {
        Question[] memory res = new Question[](questions.length);
        for (uint i = 0; i < questions.length; i++) {
            res[i] = questions[i];
        }
        return res;
    }
    
    function addQuestion(string memory question, string[]  memory answers, uint256 correct_answer_index) external payable {
        require(correct_answer_index < answers.length, "answer index is out of range");
        bytes32 question_id = keccak256(abi.encodePacked(question, msg.sender, block.number));
        uint256 reward = msg.value;
        
        id_to_index[question_id] = questions.length;
        id_to_answer[question_id] = correct_answer_index;
        
        questions.push(Question(question_id, question, answers, reward));
    }
    
    function answerQuestion(bytes32 question_id, uint256 correct_index) external {
        require(correct_index == id_to_answer[question_id], "wrong answer");
        uint256 reward = questions[id_to_index[question_id]].reward;
        if (reward > 0) {
            msg.sender.transfer(reward);
        }
        
        // delete an element from the array
        uint256 index = id_to_index[question_id];
        for(uint i = index; index < questions.length-1; index++) {
            bytes32 temp_q_id = questions[i+1].id;
            questions[i] = questions[i+1];
            id_to_index[temp_q_id] = i;
        }
        delete questions[questions.length-1];
        questions.pop();
        
        delete id_to_answer[question_id];
        delete id_to_index[question_id];
    }
}