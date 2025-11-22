/**
 * Simple regex-based Solidity ABI Generator
 * Note: This is a client-side approximation and may not cover all complex Solidity features.
 * It focuses on public/external functions to enable interaction.
 */

export function generateAbiFromSource(sourceCode) {
    if (!sourceCode) return [];
  
    // Remove comments
    const cleanCode = sourceCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    
    const abi = [];
    
    // Regex to match function definitions
    // Matches: function name(params) visibility mutability returns (outputs)
    // We strictly look for public or external functions
    const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*(?:public|external)(?:\s+(pure|view|payable))?/g;
    
    // Regex to match constructor
    const constructorRegex = /constructor\s*\((.*?)\)\s*(?:payable)?/g;
  
    // Helper to parse parameters string like "uint256 amount, address recipient"
    const parseParams = (paramStr) => {
      if (!paramStr || !paramStr.trim()) return [];
      
      return paramStr.split(',').map(param => {
        param = param.trim();
        // Handle "uint256 indexed amount" or "uint256 memory amount" or "address calldata recipient"
        const parts = param.split(/\s+/).filter(p => 
          !['memory', 'calldata', 'storage', 'indexed'].includes(p)
        );
        
        // Usually [type, name] or just [type]
        return {
          type: parts[0],
          name: parts.length > 1 ? parts[1] : '',
          internalType: parts[0] // approximation
        };
      });
    };
  
    // 1. Find functions
    let match;
    while ((match = functionRegex.exec(cleanCode)) !== null) {
      const functionName = match[1];
      const paramsStr = match[2];
      const mutability = match[3] || 'nonpayable'; // default to nonpayable if not pure/view/payable
      
      const inputs = parseParams(paramsStr);
      
      // Attempt to find returns
      // This is tricky with regex because of the potential for complex return types and formatted code.
      // We'll peek ahead from the end of the match.
      const remainingCode = cleanCode.slice(match.index + match[0].length);
      const returnsMatch = remainingCode.match(/^\s*returns\s*\((.*?)\)/);
      
      let outputs = [];
      if (returnsMatch) {
        outputs = parseParams(returnsMatch[1]);
      }
  
      abi.push({
        type: 'function',
        name: functionName,
        inputs: inputs,
        outputs: outputs,
        stateMutability: mutability
      });
    }
  
    // 2. Find constructor
    while ((match = constructorRegex.exec(cleanCode)) !== null) {
      const paramsStr = match[1];
      const inputs = parseParams(paramsStr);
      
      abi.push({
        type: 'constructor',
        inputs: inputs,
        stateMutability: cleanCode.includes('payable') && match[0].includes('payable') ? 'payable' : 'nonpayable'
      });
    }
  
    return abi;
  }
