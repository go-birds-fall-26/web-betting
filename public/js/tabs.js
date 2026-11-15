function setupTabs(container) {
  const buttons = container.querySelectorAll('[data-tab]');
  const panels = container.querySelectorAll('[data-panel]');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(other => {
        other.setAttribute('aria-selected', other === button);
      });

      panels.forEach(panel => {
        panel.hidden = panel.dataset.panel !== button.dataset.tab;
      });
    });
  });
}

document.querySelectorAll('[data-tabs]').forEach(setupTabs);
