(async function () {
  // Ваш список пунктов для выделения
  const targetLabels = [
      "Пункт: 2 Правил", "Пункт: 2(1) Правил", "Пункт: 3 Правил", "Пункт: 4 Правил", "Пункт: 5 Правил", "Пункт: 6 Правил", "Пункт: 7 Правил", "Пункт: 8 Правил", "Пункт: 9 Правил", "Пункт: 10 Правил", "Пункт: 11 Правил", "Пункт: 12 Правил", "Пункт: 13 Правил", "Пункт: 14 Правил", "Пункт: 15 Правил", "Пункт: 16 Правил", "Пункт: 17 Правил", "Пункт: 17(1) Правил", "Пункт: 18 Правил", "Пункт: 19 Правил", "Пункт: 21 Правил", "Пункт: 22 Правил", "Пункт: 23 Правил", "Пункт: 25 Правил", "Пункт: 26 Правил", "Пункт: 27 Правил", "Пункт: 28 Правил", "Пункт: 30 Правил", "Пункт: 31 Правил", "Пункт: 32 Правил", "Пункт: 33 Правил", "Пункт: 34 Правил", "Пункт: 35 Правил", "Пункт: 36 Правил", "Пункт: 37 Правил", "Пункт: 38 Правил", "Пункт: 39 Правил", "Пункт: 40 Правил", "Пункт: 41 Правил", "Пункт: 42 Правил", "Пункт: 43 Правил", "Пункт: 44 Правил", "Пункт: 45 Правил", "Пункт: 46 Правил", "Пункт: 47 Правил", "Пункт: 48 Правил", "Пункт: 49 Правил", "Пункт: 50 Правил", "Пункт: 51 Правил", "Пункт: 52 Правил", "Пункт: 53 Правил", "Пункт: 54 Правил", "Пункт: 55 Правил", "Пункт: 56 Правил", "Пункт: 57 Правил", "Пункт: 58 Правил", "Пункт: 60 Правил", "Пункт: 77 Правил", "Пункт: 78 Правил", "Пункт: 79 Правил", "Пункт: 80 Правил", "Пункт: 81 Правил", "Пункт: 82 Правил", "Пункт: 83 Правил", "Пункт: 84 Правил", "Пункт: 85 Правил", "Пункт: 86 Правил", "Пункт: 87 Правил"
  ];

  // Исключения для конкретных пунктов
  const excludeMap = {
    "Пункт: 2 Правил": [
      "Другое / прочее: абзац 1",
      "Другое / прочее: абзац 2",
      "Другое / прочее: абзац 3"
    ],
    "Пункт: 3 Правил": [
      "Другое / прочее: абзац 2"
    ],
    "Пункт: 13 Правил": [
      "Другое / прочее: абзац 2"
    ],
    "Пункт: 16 Правил": [
      "Подпункт: а"
    ],
    "Пункт: 17(1) Правил": [
      "Другое / прочее: абзац 2"
    ],
    "Пункт: 26 Правил": [
      "Другое / прочее: абзац 3"
    ],
    "Пункт: 37 Правил": [
      "Другое / прочее: абзац 4"
    ],
    "Пункт: 43 Правил": [
      "Другое / прочее: абзац 2"
    ],
    "Пункт: 79 Правил": [
      "Подпункт: и"
    ],
    "Пункт: 80 Правил": [
      "Подпункт: ж"
    ],
  };

  const normalize = txt => txt?.replace(/\xa0/g, ' ').replace(/\s+/g, ' ').trim();

  const clickSpan = s => {
    s?.scrollIntoView({ behavior: 'auto', block: 'center' }); // быстрый скролл
    s?.focus();
    s?.click();
  };

  const getMarginLeft = el => {
    const style = el.getAttribute('style') || '';
    const match = style.match(/margin-left:\s*calc\(14% \+ (\d+)px\)/);
    return match ? parseInt(match[1]) : 0;
  };

  const allUnits = Array.from(document.querySelectorAll('div._UnitWrapper_5g54m_7'));
  const normalizeMap = new Map(allUnits.map(u => [normalize(u.querySelector('span')?.textContent), u]));

  for (const targetLabel of targetLabels) {
    const targetWrapper = normalizeMap.get(normalize(targetLabel));
    if (!targetWrapper) {
      console.warn(`❌ Пункт не найден: ${targetLabel}`);
      continue;
    }

    console.log(`🔍 Найден: ${targetLabel}`);
    const success = [], failed = [];
    let expanded = false;

    const collapseIcon = targetWrapper.querySelector('svg._IconCollapse_5g54m_18');
    const iconParent = collapseIcon?.closest('div');

    if (iconParent) {
      iconParent.click();
      expanded = true;
      console.log("📂 Пункт раскрыт");
      await new Promise(r => setTimeout(r, 150));
    } else {
      console.warn(`⚠️ Пункт "${targetLabel}" не имеет иконки раскрытия — пробуем отметить`);
    }

    if (expanded) {
      const container = targetWrapper.closest('div._Wrapper_5g54m_1');
      const allNested = Array.from(container?.querySelectorAll('div._UnitWrapper_5g54m_7') ?? []);
      const maxDepth = Math.max(...allNested.map(getMarginLeft));

      for (const unit of allNested) {
        const span = unit.querySelector('span');
        const input = unit.querySelector('input._CheckboxInput_7esd8_10');
        const style = span?.getAttribute('style') || '';
        const margin = getMarginLeft(unit);
        const text = normalize(span?.textContent);

        if (
          span && input &&
          style.includes("cursor: pointer") &&
          margin === maxDepth
        ) {
          // Если для этого пункта есть исключения, проверяем их
          const exclusions = excludeMap[targetLabel] || [];
          const isExcluded = exclusions.some(ex => text.includes(ex));
          if (isExcluded) {
            console.log(`⛔ Пропущено (исключено): ${text}`);
            continue;
          }

          clickSpan(span);
          await new Promise(r => setTimeout(r, 100));
          input.checked ? success.push(text) : failed.push(text);
        }
      }
    } else {
      const span = targetWrapper.querySelector('span');
      const input = targetWrapper.querySelector('input._CheckboxInput_7esd8_10');
      const style = span?.getAttribute('style') || '';
      const text = normalize(span?.textContent);

      // Для пункта без раскрытия тоже проверяем исключения, если они есть
      const exclusions = excludeMap[targetLabel] || [];
      const isExcluded = exclusions.some(ex => text.includes(ex));

      if (span && input && style.includes("cursor: pointer") && !isExcluded) {
        clickSpan(span);
        await new Promise(r => setTimeout(r, 100));
        input.checked ? success.push(text) : failed.push(text);
      } else if (isExcluded) {
        console.log(`⛔ Пропущено (исключено): ${text}`);
      } else {
        failed.push(`${targetLabel} (недоступен для отметки)`);
      }
    }

    console.log(`✅ Отмечено (${targetLabel}) — ${success.length}:`);
    success.forEach(t => console.log(`— ${t}`));
    if (failed.length) {
      console.warn(`❌ Не удалось отметить (${targetLabel}) — ${failed.length}:`);
      failed.forEach(t => console.warn(`— ${t}`));
    } else {
      console.log(`🎉 Все нужные элементы успешно отмечены для "${targetLabel}"`);
    }
  }
})();

