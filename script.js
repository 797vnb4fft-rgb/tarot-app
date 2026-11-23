const startButton = document.querySelector(".start-button");
const spreadOptions = document.querySelector(".spread-options");
const screens = {
  spread: document.querySelector(".spread-screen"),
  deck: document.querySelector(".deck-screen"),
  result: document.querySelector(".result-screen"),
};
const deckGrid = document.querySelector(".deck-grid");
const deckActionButton = document.querySelector(".deck-action-button");
const showResultButton = document.querySelector(".show-result-button");
const selectionCount = document.querySelector(".selection-count");
const resultCards = document.querySelector(".result-screen .cards");
const resultTitle = document.querySelector(".result-title");
const screenInstructions = document.querySelector(".deck-screen .screen-instructions");
const resetButton = document.querySelector(".reset-button");
const backButton = document.querySelector(".back-button");
let pendingCards = [];
let revealedCardCount = 0;
let shuffledCardNumbers = [];
let selectedCardNumbers = [];
let selectedSpreadKey = "";
let hasShuffled = false;
let isSelectingCards = false;
let isShuffling = false;
const cardNumbers = Array.from({ length: 22 }, (_, index) =>
  String(index).padStart(2, "0")
);
const readingSpreads = {
  pastPresentFuture: [
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
  ],
  situationProblemAdvice: [
    {
      label: "状況",
      context: (meaning) => `現在の状況には「${meaning}」が表れています。`,
    },
    {
      label: "問題",
      context: (meaning) => `向き合う課題として「${meaning}」が示されています。`,
    },
    {
      label: "アドバイス",
      context: (meaning) => `行動のヒントは「${meaning}」です。`,
    },
  ],
  youOtherRelationship: [
    {
      label: "あなた",
      context: (meaning) => `あなたの気持ちや姿勢には「${meaning}」が表れています。`,
    },
    {
      label: "相手",
      context: (meaning) => `相手の様子には「${meaning}」が表れているようです。`,
    },
    {
      label: "関係性",
      context: (meaning) => `二人の関係では「${meaning}」がテーマになっています。`,
    },
  ],
  choiceAChoiceBAdvice: [
    {
      label: "選択肢A",
      context: (meaning) => `選択肢Aを選ぶ場合は「${meaning}」がポイントになりそうです。`,
    },
    {
      label: "選択肢B",
      context: (meaning) => `選択肢Bを選ぶ場合は「${meaning}」がポイントになりそうです。`,
    },
    {
      label: "選んだあと",
      context: (meaning) => `選択後の流れには「${meaning}」が示されています。`,
    },
  ],
  mindBodySoul: [
    {
      label: "心",
      context: (meaning) => `心の状態には「${meaning}」が表れています。`,
    },
    {
      label: "体",
      context: (meaning) => `体をいたわるヒントとして「${meaning}」を意識してみましょう。`,
    },
    {
      label: "魂",
      context: (meaning) => `あなたの内面が求めているものとして「${meaning}」が示されています。`,
    },
  ],
  morningNoonNight: [
    {
      label: "朝",
      context: (meaning) => `朝は「${meaning}」を意識して始めてみましょう。`,
    },
    {
      label: "昼",
      context: (meaning) => `昼は「${meaning}」が行動のヒントになりそうです。`,
    },
    {
      label: "夜",
      context: (meaning) => `夜は「${meaning}」を振り返り、ゆっくり過ごしましょう。`,
    },
  ],
  choiceAChoiceBAdvice: [
    {
      label: "選択肢A",
      context: (meaning) => `Aを選ぶ場合は「${meaning}」がポイントになりそうです。`,
    },
    {
      label: "選択肢B",
      context: (meaning) => `Bを選ぶ場合は「${meaning}」がポイントになりそうです。`,
    },
    {
      label: "アドバイス",
      context: (meaning) => `選択を考えるときは「${meaning}」を参考にしてみましょう。`,
    },
  ],
  pastPresentOneMonth: [
    {
      label: "過去",
      context: (meaning) => `これまでの経験には「${meaning}」が表れていたようです。`,
    },
    {
      label: "現在",
      context: (meaning) => `今は「${meaning}」が大切なテーマです。`,
    },
    {
      label: "1ヶ月後",
      context: (meaning) => `1ヶ月後に向けて「${meaning}」を意識するとよいでしょう。`,
    },
  ],
};
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

function showScreen(screenName) {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== screenName;
    if (name === screenName) {
      screen.scrollTop = 0;
    }
  });
}

function shuffle(items) {
  const shuffledItems = [...items];
  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }
  return shuffledItems;
}

function createDeckCard(cardNumber) {
  const button = document.createElement("button");
  button.className = "deck-card";
  button.type = "button";
  button.dataset.cardNumber = cardNumber;
  button.setAttribute("aria-label", `カード ${Number(cardNumber) + 1}`);

  const selectionBadge = document.createElement("span");
  selectionBadge.className = "deck-card-selection";
  selectionBadge.hidden = true;
  button.append(selectionBadge);

  const inner = document.createElement("span");
  inner.className = "deck-card-inner";
  const frontImage = document.createElement("img");
  frontImage.className = "deck-card-face deck-card-face--front";
  frontImage.src = `images/card_${cardNumber}.png`;
  frontImage.alt = "";
  const backImage = document.createElement("img");
  backImage.className = "deck-card-face deck-card-face--back";
  backImage.src = "images/card_22.png";
  backImage.alt = "";
  inner.append(frontImage, backImage);
  button.append(inner);

  button.addEventListener("click", () => {
    if (!isSelectingCards || button.disabled) {
      return;
    }

    if (
      selectedCardNumbers.includes(cardNumber) ||
      selectedCardNumbers.length >= 3
    ) {
      return;
    }

    selectedCardNumbers.push(cardNumber);
    button.classList.add("deck-card--selected");
    updateCardSelection();
    if (selectedCardNumbers.length === 3) {
      deckGrid.querySelectorAll(".deck-card").forEach((card) => {
        card.disabled = !selectedCardNumbers.includes(card.dataset.cardNumber);
      });
      showResultButton.hidden = false;
      showResultButton.focus({ preventScroll: true });
    }
  });

  button.addEventListener("dblclick", () => {
    const selectedIndex = selectedCardNumbers.indexOf(cardNumber);
    if (!isSelectingCards || selectedIndex === -1) {
      return;
    }

    selectedCardNumbers.splice(selectedIndex, 1);
    button.classList.remove("deck-card--selected");
    deckGrid.querySelectorAll(".deck-card").forEach((card) => {
      card.disabled = false;
    });
    updateCardSelection();
    showResultButton.hidden = true;
  });

  return button;
}

function updateCardSelection() {
  selectedCardNumbers.forEach((cardNumber, index) => {
    const card = deckGrid.querySelector(
      `.deck-card[data-card-number="${cardNumber}"]`
    );
    if (!card) {
      return;
    }

    const badge = card.querySelector(".deck-card-selection");
    badge.textContent = `${index + 1}枚目`;
    badge.hidden = false;
    card.setAttribute(
      "aria-label",
      `カード ${Number(cardNumber) + 1}、${index + 1}枚目に選択中。ダブルクリックで選択解除`
    );
  });

  deckGrid.querySelectorAll(".deck-card").forEach((card) => {
    if (selectedCardNumbers.includes(card.dataset.cardNumber)) {
      return;
    }
    const badge = card.querySelector(".deck-card-selection");
    badge.hidden = true;
    card.setAttribute(
      "aria-label",
      `カード ${Number(card.dataset.cardNumber) + 1}`
    );
  });

  selectionCount.textContent = `選んだカード：${selectedCardNumbers.length} / 3（選択済みをダブルクリックで解除）`;
}

function buildResultCard(cardNumber, index) {
  const cardIndex = Number(cardNumber);
  const readingPositions = readingSpreads[selectedSpreadKey];
  const position = readingPositions[index];
  const isReversed = Math.random() < 0.5;
  const [name, uprightMeaning, reversedMeaning] = cardReadings[cardIndex];
  const article = document.createElement("article");
  article.className = "card-reading";

  const revealCardButton = document.createElement("button");
  revealCardButton.className = "card-reveal-button";
  revealCardButton.type = "button";
  revealCardButton.textContent = `${position.label}のカードを表示する`;
  revealCardButton.disabled = index !== 0;
  article.append(revealCardButton);

  const positionHeading = document.createElement("h2");
  positionHeading.className = "card-reading-position";
  positionHeading.textContent = position.label;
  article.append(positionHeading);

  const imageContainer = document.createElement("figure");
  imageContainer.className = "card-reading-image";
  const flipper = document.createElement("div");
  flipper.className = "card-flipper";
  const backImage = document.createElement("img");
  backImage.className = "card-face card-face--back";
  backImage.src = "images/card_22.png";
  backImage.alt = "タロットカードの裏面";
  const frontImage = document.createElement("img");
  frontImage.className = isReversed
    ? "card-face card-face--front card-face--reversed"
    : "card-face card-face--front";
  frontImage.src = `images/card_${cardNumber}.png`;
  frontImage.alt = `${name}${isReversed ? "（逆位置）" : "（正位置）"}`;
  flipper.append(backImage, frontImage);
  imageContainer.append(flipper);
  article.append(imageContainer);

  const cardDetails = document.createElement("div");
  cardDetails.className = "card-details";
  cardDetails.hidden = true;
  const nameHeading = document.createElement("h3");
  nameHeading.className = "card-reading-name";
  nameHeading.textContent = name;
  cardDetails.append(nameHeading);

  const orientation = document.createElement("p");
  orientation.className = "card-reading-orientation";
  orientation.textContent = isReversed ? "逆位置" : "正位置";
  cardDetails.append(orientation);

  const meaning = document.createElement("p");
  meaning.className = "card-reading-meaning";
  const selectedMeaning = isReversed ? reversedMeaning : uprightMeaning;
  meaning.textContent = position.context(selectedMeaning);
  cardDetails.append(meaning);
  article.append(cardDetails);

  const cardData = { article, frontImage, backImage, flipper, cardDetails, revealCardButton };
  revealCardButton.addEventListener("click", () => {
    if (index !== revealedCardCount) {
      return;
    }

    flipper.classList.add("card-flipper--revealed");
    cardDetails.hidden = false;
    revealCardButton.textContent = `${position.label}のカードを表示しました`;
    revealCardButton.disabled = true;
    revealedCardCount += 1;

    const nextCard = pendingCards[revealedCardCount];
    if (nextCard) {
      nextCard.revealCardButton.disabled = false;
      nextCard.revealCardButton.focus({ preventScroll: true });
    } else {
      resetButton.hidden = false;
      resetButton.focus({ preventScroll: true });
    }

    if (window.matchMedia("(max-width: 700px)").matches) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      imageContainer.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  });

  return cardData;
}

function showSelectedCards() {
  isSelectingCards = false;
  pendingCards = selectedCardNumbers.map((cardNumber, index) =>
    buildResultCard(cardNumber, index)
  );
  revealedCardCount = 0;
  resultTitle.textContent = document.querySelector(
    'input[name="spread"]:checked'
  ).nextElementSibling.querySelector("strong").textContent;
  resultCards.replaceChildren(...pendingCards.map(({ article }) => article));
  resetButton.hidden = true;
  showScreen("result");
  pendingCards[0].revealCardButton.focus({ preventScroll: true });
}

spreadOptions.addEventListener("change", () => {
  startButton.disabled = false;
});

startButton.addEventListener("click", () => {
  const selectedSpread = document.querySelector(
    'input[name="spread"]:checked'
  );
  if (!selectedSpread) {
    return;
  }

  selectedSpreadKey = selectedSpread.value;
  shuffledCardNumbers = [...cardNumbers];
  selectedCardNumbers = [];
  hasShuffled = false;
  isSelectingCards = false;
  isShuffling = false;
  selectionCount.hidden = true;
  showResultButton.hidden = true;
  deckActionButton.hidden = false;
  deckActionButton.disabled = false;
  deckActionButton.textContent = "シャッフルする";
  screenInstructions.textContent = "カードをよく見て、シャッフルを始めましょう。";
  deckGrid.replaceChildren(
    ...shuffledCardNumbers.map((cardNumber) => createDeckCard(cardNumber))
  );
  showScreen("deck");
  deckActionButton.focus({ preventScroll: true });
});

deckActionButton.addEventListener("click", async () => {
  if (isShuffling) {
    return;
  }

  if (!hasShuffled) {
    const deckCards = [...deckGrid.querySelectorAll(".deck-card")];

    if (
      deckCards.some((card) => {
        const back = card.querySelector(".deck-card-face--back");
        return !back.complete || back.naturalWidth === 0;
      })
    ) {
      screenInstructions.textContent = "カード画像を読み込めませんでした。ページを再読み込みしてください。";
      return;
    }

    isShuffling = true;
    deckActionButton.disabled = true;
    shuffledCardNumbers = shuffle(shuffledCardNumbers);
    const cardsByNumber = new Map(
      deckCards.map((card) => [card.dataset.cardNumber, card])
    );
    shuffledCardNumbers.forEach((cardNumber, index) => {
      const card = cardsByNumber.get(cardNumber);
      card.classList.remove("deck-card--selectable", "deck-card--selected");
      card.classList.add("deck-card--shuffling");
      card.disabled = true;
      card.style.animationDelay = `${index * 18}ms`;
      deckGrid.append(card);
    });

    await new Promise((resolve) => setTimeout(resolve, 1800));
    deckCards.forEach((card) => {
      card.classList.remove("deck-card--shuffling");
      card.classList.add("deck-card--back");
      card.style.animationDelay = "";
      card.disabled = false;
      card.classList.add("deck-card--selectable");
    });
    hasShuffled = true;
    isShuffling = false;
    isSelectingCards = true;
    selectionCount.textContent = "選んだカード：0 / 3（選択済みをダブルクリックで解除）";
    selectionCount.hidden = false;
    showResultButton.hidden = true;
    deckActionButton.hidden = true;
    screenInstructions.textContent = "裏向きになったカードから、直感で3枚選んでください。選んだカードはダブルクリックで解除できます。";
    return;
  }
});

backButton.addEventListener("click", () => {
  showScreen("spread");
  startButton.focus({ preventScroll: true });
});

showResultButton.addEventListener("click", showSelectedCards);

resetButton.addEventListener("click", () => {
  pendingCards = [];
  selectedCardNumbers = [];
  revealedCardCount = 0;
  selectedSpreadKey = "";
  hasShuffled = false;
  isSelectingCards = false;
  showResultButton.hidden = true;
  spreadOptions.querySelectorAll('input[name="spread"]').forEach((input) => {
    input.checked = false;
  });
  startButton.disabled = true;
  showScreen("spread");
  spreadOptions
    .querySelector('input[name="spread"]')
    .focus({ preventScroll: true });
});
