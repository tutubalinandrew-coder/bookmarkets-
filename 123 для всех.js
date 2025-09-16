(async function () {
  const targetArticles = [
    "Статья: 4", "Статья: 6", "Статья: 24", "Статья: 25", "Статья: 26", "Статья: 27",
    "Статья: 51", "Статья: 52", "Статья: 53", "Статья: 54", "Статья: 55", "Статья: 56",
    "Статья: 57", "Статья: 58", "Статья: 59", "Статья: 61", "Статья: 62", "Статья: 64",
    "Статья: 68", "Статья: 69", "Статья: 70", "Статья: 71", "Статья: 73", "Статья: 74",
    "Статья: 76", "Статья: 78", "Статья: 79", "Статья: 80", "Статья: 81", "Статья: 82",
    "Статья: 83", "Статья: 84", "Статья: 85", "Статья: 86", "Статья: 87", "Статья: 88",
    "Статья: 89", "Статья: 90", "Статья: 91", "Статья: 93", "Статья: 94", "Статья: 95",
    "Статья: 96", "Статья: 97", "Статья: 98", "Статья: 99", "Статья: 100", "Статья: 103",
    "Статья: 104", "Статья: 111", "Статья: 112", "Статья: 113", "Статья: 114", "Статья: 115",
    "Статья: 116", "Статья: 117", "Статья: 133", "Статья: 134", "Статья: 135", "Статья: 137",
    "Статья: 139", "Статья: 140"
  ];

  const container = document.querySelector('div._StructuresList_qq842_78');
  if (!container) {
    console.error('❌ Контейнер _StructuresList_qq842_78 не найден');
    return;
  }

  const delay = ms => new Promise(r => setTimeout(r, ms));
  const normalize = t => t?.replace(/\xa0/g, ' ').replace(/\s+/g, ' ').trim();
  const getMarginLeft = el => {
    const style = el?.getAttribute('style') || '';
    const match = style.match(/margin-left:\s*calc\(14% \+ (\d+)px\)/);
    return match ? parseInt(match[1]) : 0;
  };

  async function expandAllRecursively(level = 0) {
    let expandedAny = false;
    const items = Array.from(container.querySelectorAll('div._UnitWrapper_5g54m_7'));
    for (const item of items) {
      const icon = item.querySelector('svg._IconCollapse_5g54m_18.false');
      if (icon && icon instanceof Element) {
        const label = normalize(item.querySelector('span')?.textContent);
        console.log(`➡️ Раскрытие: "${label}" (уровень ${level})`);
        icon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expandedAny = true;
        await delay(150);
      }
    }
    if (expandedAny) {
      await expandAllRecursively(level + 1);
    }
  }

  function uncheckAll() {
    const units = container.querySelectorAll('div._UnitWrapper_5g54m_7');
    let count = 0;
    units.forEach(unit => {
      const input = unit.querySelector('input._CheckboxInput_7esd8_10');
      const span = unit.querySelector('span');
      if (input && input.checked && span) {
        const label = normalize(span.textContent);
        console.log(`🔘 Снята галочка: "${label}"`);
        span.click();
        count++;
      }
    });
    console.log(`✅ Снято ${count} галочек`);
  }

  async function markTargetArticles() {
    const allUnits = Array.from(container.querySelectorAll('div._UnitWrapper_5g54m_7'));
    for (let i = 0; i < allUnits.length; i++) {
      const unit = allUnits[i];
      const span = unit.querySelector('span');
      const text = normalize(span?.textContent);
      if (!text) continue;

      if (!targetArticles.some(article => text.includes(article))) continue;

      console.log(`🎯 Найдена целевая статья: "${text}"`);

      const collapseIcon = unit.querySelector('svg._IconCollapse_5g54m_18.false');
      if (collapseIcon) {
        console.log(`➡️ Раскрытие вложений для: "${text}"`);
        collapseIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await delay(200);
      }

      const baseMargin = getMarginLeft(unit);
      const nested = [];

      for (let j = i + 1; j < allUnits.length; j++) {
        const next = allUnits[j];
        const nextMargin = getMarginLeft(next);
        if (nextMargin <= baseMargin) break;
        nested.push(next);
      }

      if (span && !unit.querySelector('input._CheckboxInput_7esd8_10').checked) {
        console.log(`☑️ Отмечена статья: "${text}"`);
        span.click();
        await delay(100);
      }

      for (const nestedUnit of nested) {
        const nestedSpan = nestedUnit.querySelector('span');
        const nestedInput = nestedUnit.querySelector('input._CheckboxInput_7esd8_10');
        const nestedText = normalize(nestedSpan?.textContent);
        if (nestedSpan && nestedInput && !nestedInput.checked) {
          console.log(`  └─ ☑️ Вложенный пункт: "${nestedText}"`);
          nestedSpan.click();
          await delay(80);
        }
      }
    }
  }

  console.log('🔄 Начало обработки...');
  await expandAllRecursively();
  console.log('📂 Все блоки раскрыты');

  uncheckAll();

  console.log('🔍 Поиск и отметка целевых статей...');
  await markTargetArticles();

  console.log('✅ Обработка завершена: статьи отмечены, галочки сняты, все раскрыто');
})();
