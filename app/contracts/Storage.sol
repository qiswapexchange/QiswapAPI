contract Storage {
    uint public val;

    function getVal () view public returns (uint) {
        return val;
    }

    function setVal(uint _val) public {
        val =_val;
    }
}