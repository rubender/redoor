
const hasOwnProperty = Object.prototype.hasOwnProperty;

function is(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
export function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  let i = keysA.length;
  while(i--) {
  //for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}





export const getStatePropsFilterFunction = (filterParam)=>{
  let stateToPropsFunc = state => state;  // no filter

  if (!!filterParam) { // DOC: with filter
    if (typeof filterParam === 'string') { // DOC: filter is string
      filterParam = filterParam.replace(/\s+/g, '');
      let paramsValueNames = filterParam.split(/[,]/g).filter(i=>i.length);

      stateToPropsFunc = state => {
        return paramsValueNames.reduce( (a,k) => (a[k] = state[k],a), {} );
      };
    }

    if (typeof filterParam === 'function') { // DOC: filter custim function
      stateToPropsFunc = filterParam;
    }

  }
  return stateToPropsFunc;
}



