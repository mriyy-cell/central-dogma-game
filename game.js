// --- ゲームの状態（データ） ---
const state = {
  dna: 0,
  rna: 0,
  protein: 0,
  
  // 施設レベル
  rnaPolymerase: 0,
  ribosome: 0,
  chaperone: 0,
  
  // コスト
  polCost: 10,
  riboCost: 10,
  chapCost: 20
};

// --- DOM要素の取得 ---
const elDna = document.getElementById('dna-count');
const elRna = document.getElementById('rna-count');
const elProtein = document.getElementById('protein-count');
const elRnaRate = document.getElementById('rna-rate');
const elProteinRate = document.getElementById('protein-rate');

const btnClick = document.getElementById('click-btn');
const btnBuyPol = document.getElementById('buy-pol');
const btnBuyRibo = document.getElementById('buy-ribo');
const btnBuyChap = document.getElementById('buy-chap');

// --- 手動クリック（転写） ---
btnClick.addEventListener('click', () => {
  state.dna += 1;
  state.rna += 1; // クリックでDNA消費＆mRNA生成
  updateUI();
});

// --- 強化1: RNAポリメラーゼ購入 ---
btnBuyPol.addEventListener('click', () => {
  if (state.dna >= state.polCost) {
    state.dna -= state.polCost;
    state.rnaPolymerase += 1;
    state.polCost = Math.floor(state.polCost * 1.5);
    updateUI();
  }
});

// --- 強化2: リボソーム購入 ---
btnBuyRibo.addEventListener('click', () => {
  if (state.rna >= state.riboCost) {
    state.rna -= state.riboCost;
    state.ribosome += 1;
    state.riboCost = Math.floor(state.riboCost * 1.5);
    updateUI();
  }
});

// --- 強化3: 分子シャペロン購入 ---
btnBuyChap.addEventListener('click', () => {
  if (state.protein >= state.chapCost) {
    state.protein -= state.chapCost;
    state.chaperone += 1;
    state.chapCost = Math.floor(state.chapCost * 1.5);
    updateUI();
  }
});

// --- 毎秒の自動処理（ループ） ---
setInterval(() => {
  // RNAポリメラーゼによる自動mRNA生成
  const rnaGen = state.rnaPolymerase * 1;
  state.rna += rnaGen;

  // リボソームによる自動タンパク質生成（シャペロンの倍率は1 + 0.5 * Lv）
  const multiplier = 1 + (state.chaperone * 0.5);
  const proteinGen = Math.floor(state.ribosome * 1 * multiplier);
  
  // タンパク質生成にはmRNAが必要（足りない場合はあるだけ消費）
  if (state.rna >= proteinGen) {
    state.rna -= proteinGen;
    state.protein += proteinGen;
  } else {
    state.protein += state.rna;
    state.rna = 0;
  }

  updateUI();
}, 1000);

// --- 画面表示（UI）更新機能 ---
function updateUI() {
  elDna.innerText = Math.floor(state.dna);
  elRna.innerText = Math.floor(state.rna);
  elProtein.innerText = Math.floor(state.protein);

  // 秒間生成量の計算表示
  const rnaRate = state.rnaPolymerase;
  const multiplier = 1 + (state.chaperone * 0.5);
  const proteinRate = Math.floor(state.ribosome * multiplier);
  
  elRnaRate.innerText = rnaRate;
  elProteinRate.innerText = proteinRate;

  // ボタンの表示更新（レベル・コスト）
  document.getElementById('pol-lv').innerText = state.rnaPolymerase;
  document.getElementById('pol-cost').innerText = state.polCost;
  document.getElementById('ribo-lv').innerText = state.ribosome;
  document.getElementById('ribo-cost').innerText = state.riboCost;
  document.getElementById('chap-lv').innerText = state.chaperone;
  document.getElementById('chap-cost').innerText = state.chapCost;

  // 購入条件を満たしていないボタンの無効化（グレーアウト）
  btnBuyPol.disabled = state.dna < state.polCost;
  btnBuyRibo.disabled = state.rna < state.riboCost;
  btnBuyChap.disabled = state.protein < state.chapCost;
}

// 初回UI描画
updateUI();
