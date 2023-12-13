// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity 0.8.19;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "./FHEordle.sol";
import "fhevm/lib/TFHE.sol";


contract FHEordleFactory is EIP712WithModifier {

    address public creator;

    mapping(address => address) public userLastContract;

    constructor() EIP712WithModifier("Authorization token", "1") {
        creator = msg.sender;
    }

    function createGame(address _relayerAddr) public {
        if (userLastContract[msg.sender] != address(0)) {
            FHEordle game = FHEordle(userLastContract[msg.sender]);
            require(
                game.playerWon() || (game.nGuesses() == 5),
                "Previous game has not ended"
            );
        }
        userLastContract[msg.sender] = address(
            new FHEordle(
                msg.sender,
                _relayerAddr,
                0,
                0xd34274ed281b4de16823ef28eff9d2164ca3dc2ba8d38e1861bbf74597760d3e,
                3
            )
        );
    }

    function createTest(address _relayerAddr) public {
        require(userLastContract[msg.sender] == address(0), "kek");
        userLastContract[msg.sender] = address(
            new FHEordle(
                msg.sender,
                _relayerAddr,
                3,
                0xd34274ed281b4de16823ef28eff9d2164ca3dc2ba8d38e1861bbf74597760d3e,
                3
            )
        );
    }

    function gameNotStarted() public view returns (bool){
        if (userLastContract[msg.sender] != address(0)) {
            FHEordle game = FHEordle(userLastContract[msg.sender]);
            return game.playerWon() || (game.nGuesses() == 5);
        }
        return true;
    }



}