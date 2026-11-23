const shuffleButton = document.querySelector(".shuffle-button");
const cardsContainer = document.querySelector(".cards");
const loadingPanel = document.querySelector(".loading");
const cardNumbers = Array.from({ length: 22 }, (_, index) =>
  String(index).padStart(2, "0")
);
const readingPositions = [
  {
    label: "過去",
    context: (meaning) => `過去の出来事や経験には「${meaning}」が表れていたようです。`,
  },
  {
    label: "現在",
    context: (meaning) => `今の状況では「${meaning}」が大切なテーマです。`,
  },
  {
    label: "未来",
    context: (meaning) => `これからは「${meaning}」を意識するとよいでしょう。`,
  },
];
const cardReadings = [
  ["愚者", "新しい一歩、自由な発想、未知への期待。", "準備不足、無計画、軽率な行動への注意。"],
  ["魔術師", "才能の発揮、始まり、考えを形にする力。", "自信のなさ、準備不足、力を活かせない状態。"],
  ["女教皇", "直感、知性、静かに見極めること。", "考えすぎ、秘密、感情を抑え込みすぎること。"],
  ["女帝", "豊かさ、実り、愛情や創造性が育つこと。", "過保護、依存、満たされなさ。"],
  ["皇帝", "責任感、安定、計画を実行する力。", "頑固さ、支配的な態度、基盤の不安定さ。"],
  ["教皇", "助言、信頼できる学び、伝統や協力。", "形式へのこだわり、視野の狭さ、助言への反発。"],
  ["恋人", "心が通じる選択、調和、価値観の一致。", "迷い、すれ違い、選択への不誠実さ。"],
  ["戦車", "強い意志、前進、困難を乗り越える力。", "焦り、空回り、進む方向を見失うこと。"],
  ["力", "思いやり、自制心、穏やかな粘り強さ。", "自信の揺らぎ、感情的になること、無理のしすぎ。"],
  ["隠者", "内省、探求、ひとりで答えを見つける時間。", "孤立、閉じこもり、考えが堂々巡りすること。"],
  ["運命の輪", "転機、好機、物事が動き出すこと。", "タイミングのずれ、停滞、変化への抵抗。"],
  ["正義", "公平な判断、誠実さ、行動に見合う結果。", "偏った判断、不公平、責任から目をそらすこと。"],
  ["吊るされた男", "視点を変えること、忍耐、意味のある待ち時間。", "報われない我慢、行き詰まり、視野の狭さ。"],
  ["死神", "ひと区切り、手放すこと、新しい段階への移行。", "変化への執着、終わりを受け入れられないこと。"],
  ["節制", "調和、適度なバランス、異なるものを活かすこと。", "不均衡、極端さ、ペースの乱れ。"],
  ["悪魔", "欲望や執着に気づくこと、誘惑との向き合い。", "束縛から離れる兆し、悪習慣を断つこと。"],
  ["塔", "思い込みが崩れ、本質に気づく急な変化。", "変化の先延ばし、不安定さを見ないふりすること。"],
  ["星", "希望、癒やし、未来への素直な期待。", "自信の低下、希望を見失うこと、理想との距離。"],
  ["月", "揺れる気持ち、想像力、見えないものへの注意。", "不安が晴れる兆し、事実が見えてくること。"],
  ["太陽", "喜び、成功、素直さ、明るい見通し。", "自信過剰、期待外れ、喜びを感じにくい状態。"],
  ["審判", "再出発、気づき、過去を活かす機会。", "決断の先延ばし、過去へのこだわり、迷い。"],
  ["世界", "完成、達成、努力が実を結ぶこと。", "あと一歩の未完了、区切りをつけられないこと。"],
];

shuffleButton.addEventListener("click", async () => {
  shuffleButton.disabled = true;
  cardsContainer.replaceChildren();
  loadingPanel.hidden = false;

  const shuffledCards = [...cardNumbers];
  for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledCards[index], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[index],
    ];
  }

  const selectedCards = shuffledCards.slice(0, 3).map((cardNumber, index) => {
    const cardIndex = Number(cardNumber);
    const isReversed = Math.random() < 0.5;
    const [name, uprightMeaning, reversedMeaning] = cardReadings[cardIndex];
    const article = document.createElement("article");
    article.className = "card-reading";

    const positionHeading = document.createElement("h2");
    positionHeading.className = "card-reading-position";
    positionHeading.textContent = readingPositions[index].label;
    article.append(positionHeading);

    const imageContainer = document.createElement("figure");
    imageContainer.className = isReversed
      ? "card-reading-image card-reading-image--reversed"
      : "card-reading-image";
    const image = document.createElement("img");
    image.src = `images/card_${cardNumber}.png`;
    image.alt = `${name}${isReversed ? "（逆位置）" : "（正位置）"}`;
    imageContainer.append(image);
    article.append(imageContainer);

    const nameHeading = document.createElement("h3");
    nameHeading.className = "card-reading-name";
    nameHeading.textContent = name;
    article.append(nameHeading);

    const orientation = document.createElement("p");
    orientation.className = "card-reading-orientation";
    orientation.textContent = isReversed ? "逆位置" : "正位置";
    article.append(orientation);

    const meaning = document.createElement("p");
    meaning.className = "card-reading-meaning";
    const selectedMeaning = isReversed ? reversedMeaning : uprightMeaning;
    meaning.textContent = readingPositions[index].context(selectedMeaning);
    article.append(meaning);

    return { article, image };
  });

  try {
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 1600)),
      ...selectedCards.map(({ image }) => image.decode()),
    ]);
    cardsContainer.replaceChildren(
      ...selectedCards.map(({ article }) => article)
    );
    loadingPanel.hidden = true;
  } catch (error) {
    loadingPanel.querySelector(".loading-message").textContent =
      "カードを読み込めませんでした。もう一度お試しください。";
    console.error("タロットカードの読み込みに失敗しました。", error);
  } finally {
    shuffleButton.disabled = false;
  }
});
