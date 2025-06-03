// 用于等待动画效果
function sleep(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}

// 清空输入和动画内容
function clearAll() {
 document.getElementById('visualizationArea').innerHTML = '';
 document.getElementById('arrayInput').value = '';
 document.getElementById('lowerInput').value = '';
 document.getElementById('upperInput').value = '';
}

// 主入口：开始动画演示
async function startAnimation() {
 const arrayInput = document.getElementById('arrayInput');
 const lowerInput = document.getElementById('lowerInput');
 const upperInput = document.getElementById('upperInput');

 const nums = arrayInput.value.split(',').map(Number);
 const lower = parseInt(lowerInput.value);
 const upper = parseInt(upperInput.value);

 const container = document.getElementById('visualizationArea');
 container.innerHTML = '';

 const prefixSums = [0];
 for (let i = 0; i < nums.length; i++) {
  prefixSums.push(prefixSums[i] + nums[i]);
 }

 await displayPrefixSums(prefixSums, container);
 const count = await animatePairs(prefixSums, lower, upper, container);

 const resultDiv = document.createElement('div');
 resultDiv.innerHTML = `<h2>✨ 满足条件的区间个数: ${count}</h2>`;
 container.appendChild(resultDiv);
}

// 显示前缀和方块
async function displayPrefixSums(prefixSums, container) {
 const grid = document.createElement('div');
 grid.className = 'grid-container';
 container.appendChild(grid);

 for (let i = 0; i < prefixSums.length; i++) {
  const box = document.createElement('div');
  box.className = 'value-box';
  box.textContent = prefixSums[i];
  box.setAttribute('data-index', i);
  grid.appendChild(box);
 }
}

// 动画演示区间和计算 + 高亮展示
async function animatePairs(prefixSums, lower, upper, container) {
 const boxes = container.querySelectorAll('.value-box');
 let count = 0;

 for (let i = 0; i < prefixSums.length; i++) {
  for (let j = i + 1; j < prefixSums.length; j++) {
   const sum = prefixSums[j] - prefixSums[i];
   const boxA = boxes[i];
   const boxB = boxes[j];

   boxA.classList.add('highlight');
   boxB.classList.add('highlight');

   if (sum >= lower && sum <= upper) {
    boxA.classList.add('match');
    boxB.classList.add('match');
    const result = document.createElement('div');
    result.className = 'result-line';
    result.textContent = `✅ 区间 [${i}, ${j - 1}] -> 区间和 = ${sum}`;
    container.appendChild(result);
    count++;
   } else {
    boxA.classList.add('not-match');
    boxB.classList.add('not-match');
   }

   await sleep(600);

   boxA.classList.remove('highlight', 'match', 'not-match');
   boxB.classList.remove('highlight', 'match', 'not-match');
  }
 }

 return count;
}