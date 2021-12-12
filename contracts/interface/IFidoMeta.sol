pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFidoMeta is IERC20 {

    function decimals() external view returns (uint256);
    
    function mint(address to, uint256 amount) external;

    function cap() external view returns (uint256);

    function freezeAccount(address target, bool freeze) external;

    function transferOwnership(address newOwner) external;

}
