"use client";
import { useRef, useState } from 'react';
import MetabaseComponent from './metabaseComponent';
import styles from './stats.module.scss';

const dashboards = [
  { id: 5, titre: 'Stats privées' },
  { id: 7, titre: 'TACCToscope' },
  { id: 6, titre: 'Comptes utilisateurs' }
];

const OngletsDashboards = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = dashboards[selectedIndex];

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % dashboards.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + dashboards.length) % dashboards.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = dashboards.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setSelectedIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div className={styles.tabsContainer}>
      <div role="tablist" aria-label="Tableaux de bord" className={styles.tabButtons}>
        {dashboards.map((dashboard, index) => (
          <button
            key={dashboard.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            type="button"
            role="tab"
            id={`dashboard-tab-${dashboard.id}`}
            aria-selected={selectedIndex === index}
            aria-controls={`dashboard-panel-${dashboard.id}`}
            tabIndex={selectedIndex === index ? 0 : -1}
            className={`${styles.tabButton} ${selectedIndex === index ? styles.tabButtonActive : ''}`}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
          >
            {dashboard.titre}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`dashboard-panel-${selected.id}`}
        aria-labelledby={`dashboard-tab-${selected.id}`}
        tabIndex={0}
      >
        <MetabaseComponent key={selected.id} dashboardId={selected.id} titre={selected.titre} />
      </div>
    </div>
  );
};

export default OngletsDashboards;
