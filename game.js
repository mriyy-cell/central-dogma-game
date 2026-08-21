// --- ゲームの状態（データ） ---
const state = {
  mrna: 0,
  aminoAcid: 0,
  protein: 0,
  
  // 施設レベル
  rnaPolymerase: 0,
  ribosome: 0,
  chaperone: 0,
  
  // 基本コスト（クッキークリッカー風の緩やかな倍率計算に変更）
  polCost: 15,
  riboCost: 20,
  chapCost: 50
};

// クッキークリッカー等の標準的なコスト倍率 (1.15倍)
const COST_MULTIPLIER = 1.15;

// 各施設の単位あたりの自動生成・消費量
const POL_PRODUCTION = 1;      // 1レベルあたり +1 mRNA/秒
const RIBO_PRODUCTION = 5;     // 1レベルあたり +5 アミノ酸/秒 (要5 mRNA)
const CHAP_PRODUCTION = 20;    // 1レベルあたり +20 タンパク質/秒 (要20 アミノ酸)

// --- DOM要素の取得 ---
const elMrna = document.getElementById('dna-count');
const elAmino = document.getElementById('rna-count');
const elProtein = document.getElementById('protein-count');

const elMrnaRate = document.getElementById('mrna-rate');
const elAminoRate = document.getElementById('rna-rate');
const elProteinRate = document.getElementById('protein-rate');

// 中央DNAタップエリア
const dnaTapArea = document.getElementById('dna-tap-area');

const btnBuyPol = document.getElementById('buy-pol');
const btnBuyRibo = document.getElementById('buy-ribo');
const btnBuyChap = document.getElementById('buy-chap');

// ボタン取得
const btnTranslate = document.getElementById('translate-btn');
const btnFold = document.getElementById('fold-btn');

// --- 手動タップ（DNA転写でmRNA合成） ---
dnaTapArea.addEventListener('click', () => {
  state.mrna += 1;
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

// --- 手動折りたたみ（アミノ酸 10個 -> タンパク質 1つ） ---
btnFold.addEventListener('click', () => {
  if (state.aminoAcid >= 10) {
    state.aminoAcid -= 10;
    state.protein += 1;
    updateUI();
  }
});

// --- 強化1: RNAポリメラーゼ購入 ---
btnBuyPol.addEventListener('click', () => {
  if (state.mrna >= state.polCost) {
    state.mrna -= state.polCost;
    state.rnaPolymerase += 1;
    state.polCost = Math.floor(15 * Math.pow(COST_MULTIPLIER, state.rnaPolymerase));
    updateUI();
  }
});

// --- 強化2: リボソーム購入 ---
btnBuyRibo.addEventListener('click', () => {
  if (state.aminoAcid >= state.riboCost) {
    state.aminoAcid -= state.riboCost;
    state.ribosome += 1;
    state.riboCost = Math.floor(20 * Math.pow(COST_MULTIPLIER, state.ribosome));
    updateUI();
  }
});

// --- 強化3: 分子シャペロン購入 ---
btnBuyChap.addEventListener('click', () => {
  if (state.protein >= state.chapCost) {
    state.protein -= state.chapCost;
    state.chaperone += 1;
    state.chapCost = Math.floor(50 * Math.pow(COST_MULTIPLIER, state.chaperone));
    updateUI();
  }
});

// --- 毎秒の自動処理（ゲームループ） ---
setInterval(() => {
  // 1. RNAポリメラーゼによるmRNA自動生成
  const mrnaGen = state.rnaPolymerase * POL_PRODUCTION;
  state.mrna += mrnaGen;

  // 2. リボソームによるmRNA -> アミノ酸自動変換
  const aminoTarget = state.ribosome * RIBO_PRODUCTION;
  const aminoActual = Math.min(state.mrna, aminoTarget);
  state.mrna -= aminoActual;
  state.aminoAcid += aminoActual;

  // 3. 分子シャペロンによるアミノ酸 -> タンパク質自動変換
  const proteinTarget = state.chaperone * CHAP_PRODUCTION;
  const proteinActual = Math.min(state.aminoAcid, proteinTarget);
  state.aminoAcid -= proteinActual;
  state.protein += proteinActual;

  updateUI();
}, 1000);

// --- 画面表示（UI）更新機能 ---
function updateUI() {
  elMrna.innerText = Math.floor(state.mrna);
  elAmino.innerText = Math.floor(state.aminoAcid);
  elProtein.innerText = Math.floor(state.protein);

  // 秒間生成量の計算表示
  const currentMrnaRate = state.rnaPolymerase * POL_PRODUCTION;
  const currentAminoRate = state.ribosome * RIBO_PRODUCTION;
  const currentProteinRate = state.chaperone * CHAP_PRODUCTION;

  elMrnaRate.innerText = currentMrnaRate;
  elAminoRate.innerText = currentAminoRate;
  elProteinRate.innerText = currentProteinRate;

  // ボタンの表示更新（レベル・コスト）
  document.getElementById('pol-lv').innerText = state.rnaPolymerase;
  document.getElementById('pol-cost').innerText = state.polCost;
  document.getElementById('ribo-lv').innerText = state.ribosome;
  document.getElementById('ribo-cost').innerText = state.riboCost;
  document.getElementById('chap-lv').innerText = state.chaperone;
  document.getElementById('chap-cost').innerText = state.chapCost;

  // ボタンの有効化/無効化（グレーアウト制御）
  btnBuyPol.disabled = state.mrna < state.polCost;
  btnBuyRibo.disabled = state.aminoAcid < state.riboCost;
  btnBuyChap.disabled = state.protein < state.chapCost;
  btnTranslate.disabled = state.mrna < 3;
  btnFold.disabled = state.aminoAcid < 10;
}

// 初回UI描画
updateUI();
