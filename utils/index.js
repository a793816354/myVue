const getUniqueQueue = (arr) => {
  const result = [];
  const set = new Set();
  for (let index = 0; index < arr.length; index++) {
    const curId = arr[index];
    if (set.has(curId)) continue;
    set.add(curId);
    result.push(curId);
  }
  return result;
};

const execHook = function (hook) {

}

module.exports = {
  getUniqueQueue,
  execHook
};
