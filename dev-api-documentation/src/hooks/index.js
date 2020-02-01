import { useState } from 'react';

function useResult(initResult) {
  const [result, _setResult] = useState(initResult);

  const setResult = result => _setResult(result);
  const clearResult = () => _setResult(null);

  return { result, setResult, clearResult };
}

export {
  useResult
}
