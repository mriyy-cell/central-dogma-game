// --- ゲームの状態（データ） ---
const state = {
  mrna: 0,
  aminoAcid: 0,
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
const elMrna = document.getElementById('dna-count');
const elAmino = document.getElementById('rna-count');
const elProtein = document.getElementById('protein-count');
const elAminoRate = document.getElementById('rna-rate');
const elProteinRate = document.getElementById('protein-rate');

const btnClick = document.getElementById('click-btn');
const btnBuyPol = document.getElementById('buy-pol');
const btnBuyRibo = document.getElementById('buy-ribo');
const btnBuyChap = document.getElementById('buy-chap');

// 新しい翻訳ボタンを取得
const btnTranslate = document.getElementById('translate-btn');

// --- 手動クリック（転写） ---
btnClick.addEventListener('click', () => {
  state.mrna += 1; // クリックでmRNAを手動生成
  updateUI();
});

// --- 手動翻訳（mRNA 3つ -> アミノ酸 1つ） ---
btnTranslate.addEventListener('click', () => {
  if (state.mrna >= 3) {
    state.mrna -= 3;
    state.aminoAcid += 1;
    updateUI();
  }
});


// --- 強化1: RNAポリメラーゼ購入 (mRNA自動生成) ---
btnBuyPol.addEventListener('click', () => {
  if (state.mrna >= state.polCost) {
    state.mrna -= state.polCost;
    state.rnaPolymerase += 1;
    state.polCost = Math.floor(state.polCost * 1.5);
    updateUI();
  }
});

// --- 強化2: リボソーム購入 (mRNA -> アミノ酸変換) ---
btnBuyRibo.addEventListener('click', () => {
  if (state.aminoAcid >= state.riboCost) {
    state.aminoAcid -= state.riboCost;
    state.ribosome += 1;
    state.riboCost = Math.floor(state.riboCost * 1.5);
    updateUI();
  }
});

// --- 強化3: 分子シャペロン購入 (アミノ酸 -> タンパク質変換) ---
btnBuyChap.addEventListener('click', () => {
  if (state.protein >= state.chapCost) {
    state.protein -= state.chapCost;
    state.chaperone += 1;
    state.chapCost = Math.floor(state.chapCost * 1.5);
    updateUI();
  }
});

// --- 毎秒の自動処理（ゲームループ） ---
setInterval(() => {
  // 1. RNAポリメラーゼによるmRNA自動生成（クリック不要で増える）
  const mrnaGen = state.rnaPolymerase * 1;
  state.mrna += mrnaGen;

  // 2. リボソームによるmRNA -> アミノ酸の自動変換
  const aminoGen = state.ribosome * 1;
  if (state.mrna >= aminoGen) {
    state.mrna -= aminoGen;
    state.aminoAcid += aminoGen;
  } else {
    // mRNAが足りない場合はある分だけ変換
    state.aminoAcid += state.mrna;
    state.mrna = 0;
  }

  // 3. 分子シャペロンによるアミノ酸 -> タンパク質の自動変換
  const proteinGen = state.chaperone * 1;
  if (state.aminoAcid >= proteinGen) {
    state.aminoAcid -= proteinGen;
    state.protein += proteinGen;
  } else {
    state.protein += state.aminoAcid;
    state.aminoAcid = 0;
  }

  updateUI();
}, 1000);

// --- 画面表示（UI）更新機能 ---
function updateUI() {
  elMrna.innerText = Math.floor(state.mrna);
  elAmino.innerText = Math.floor(state.aminoAcid);
  elProtein.innerText = Math.floor(state.protein);

  // 秒間生成量の計算表示
  elAminoRate.innerText = state.ribosome;
  elProteinRate.innerText = state.chaperone;

  // ボタンの表示更新（レベル・コスト）
  document.getElementById('pol-lv').innerText = state.rnaPolymerase;
  document.getElementById('pol-cost').innerText = state.polCost;
  document.getElementById('ribo-lv').innerText = state.ribosome;
  document.getElementById('ribo-cost').innerText = state.riboCost;
  document.getElementById('chap-lv').innerText = state.chaperone;
  document.getElementById('chap-cost').innerText = state.chapCost;

  // 購入条件を満たしていないボタンの無効化（グレーアウト）
  btnBuyPol.disabled = state.mrna < state.polCost;
  btnBuyRibo.disabled = state.aminoAcid < state.riboCost;
  btnBuyChap.disabled = state.protein < state.chapCost;
  btnTranslate.disabled = state.mrna < 3;
}

// 初回UI描画
updateUI();
