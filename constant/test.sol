// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address[] public players;
    uint256 public ticketPrice = 1 ether;
    uint256 public round = 1;

    event LotteryDrawn(address[3] winners, uint256 round);
    event TicketPurchased(address indexed player, uint256 ticketNumber);

    modifier onlyWhenLotteryIsOpen() {
        require(players.length < 10, "Lottery full. Waiting for draw.");
        _;
    }

    function buyTicket() public payable onlyWhenLotteryIsOpen {
        require(msg.value == ticketPrice, "Incorrect ticket price");

        players.push(msg.sender);
        emit TicketPurchased(msg.sender, players.length);

        if (players.length == 10) {
            _drawLottery();
        }
    }

    function _drawLottery() private {
        require(players.length == 10, "Not enough players to draw the lottery");

        uint256 randomHash = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, players)));
        uint256 winner1Index = randomHash % 10;
        uint256 winner2Index = (randomHash / 10) % 10;
        uint256 winner3Index = (randomHash / 100) % 10;

        while (winner2Index == winner1Index) {
            winner2Index = (randomHash / 20) % 10;
        }
        while (winner3Index == winner1Index || winner3Index == winner2Index) {
            winner3Index = (randomHash / 30) % 10;
        }

        address winner1 = players[winner1Index];
        address winner2 = players[winner2Index];
        address winner3 = players[winner3Index];

        payable(winner1).transfer(5 ether);
        payable(winner2).transfer(3 ether);
        payable(winner3).transfer(2 ether);

        // Use a fixed-size array to match the event definition
        address[3] memory winners = [winner1, winner2, winner3];
        emit LotteryDrawn(winners, round);

        delete players; // Reset players for the next round
        round++; // Increment the round number
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
