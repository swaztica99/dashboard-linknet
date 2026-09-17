'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

// Interface Data
interface EventData {
  name: string;
  cost: string;
  mroi: string;
  value: number;
  mroiValue: number;
}

interface RegionData {
  cost: string;
  signingCost: string;
  leads: string;
  revenue: string;
  mroi: string;
  eventsCount: number;
  events: EventData[];
}

type Database = Record<string, RegionData>;

// Mock Database dengan Type Strict
const mockDatabase: Database = {
  'All regions': {
    cost: 'Rp 450M',
    signingCost: 'Rp 120M',
    leads: '1,240',
    revenue: 'Rp 1.8B',
    mroi: '3.0x',
    eventsCount: 15,
    events: [
      { name: 'Event Name 1', cost: 'Rp 80M', mroi: '4.2x', value: 90, mroiValue: 95 },
      { name: 'Event Name 2', cost: 'Rp 60M', mroi: '3.8x', value: 75, mroiValue: 80 },
      { name: 'Event Name 3', cost: 'Rp 45M', mroi: '2.9x', value: 50, mroiValue: 60 },
      { name: 'Event Name 4', cost: 'Rp 30M', mroi: '2.1x', value: 35, mroiValue: 45 },
      { name: 'Event Name 5', cost: 'Rp 20M', mroi: '1.5x', value: 25, mroiValue: 30 },
    ],
  },
  'Jakarta': {
    cost: 'Rp 250M',
    signingCost: 'Rp 70M',
    leads: '780',
    revenue: 'Rp 1.1B',
    mroi: '3.4x',
    eventsCount: 8,
    events: [
      { name: 'Jakarta Expo', cost: 'Rp 50M', mroi: '4.5x', value: 85, mroiValue: 90 },
      { name: 'Tech Summit', cost: 'Rp 40M', mroi: '3.2x', value: 65, mroiValue: 70 },
      { name: 'B2B Meetup', cost: 'Rp 30M', mroi: '2.8x', value: 45, mroiValue: 55 },
      { name: 'Partner Forum', cost: 'Rp 20M', mroi: '2.0x', value: 30, mroiValue: 40 },
      { name: 'Net Gathering', cost: 'Rp 10M', mroi: '1.2x', value: 20, mroiValue: 25 },
    ],
  },
  'Surabaya': {
    cost: 'Rp 200M',
    signingCost: 'Rp 50M',
    leads: '460',
    revenue: 'Rp 700M',
    mroi: '2.5x',
    eventsCount: 7,
    events: [
      { name: 'East Java Fest', cost: 'Rp 30M', mroi: '3.5x', value: 70, mroiValue: 75 },
      { name: 'Corporate Gala', cost: 'Rp 20M', mroi: '2.9x', value: 55, mroiValue: 60 },
      { name: 'Roadshow Sub', cost: 'Rp 15M', mroi: '2.1x', value: 40, mroiValue: 45 },
      { name: 'SME Connect', cost: 'Rp 10M', mroi: '1.8x', value: 30, mroiValue: 35 },
      { name: 'Digital Summit', cost: 'Rp 5M', mroi: '1.0x', value: 15, mroiValue: 20 },
    ],
  },
};

export default function MarketingDashboard() {
  const [region, setRegion] = useState<string>('All regions');
  const [year, setYear] = useState<string>('All years');
  const [event, setEvent] = useState<string>('All events');
  const [updatedTime, setUpdatedTime] = useState<string>('');
  const [data, setData] = useState<RegionData>(mockDatabase['All regions']);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Format Waktu Real-Time
  const updateTimestamp = (): void => {
    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setUpdatedTime(formatted);
  };

  // Timer Real-Time Berjalan Setiap Detik
  useEffect(() => {
    updateTimestamp(); // Update awal saat komponen di-mount
    const timer = setInterval(() => {
      updateTimestamp();
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer saat unmount
  }, []);

  // Update Data berdasarkan Filter Region
  useEffect(() => {
    if (mockDatabase[region]) {
      setData(mockDatabase[region]);
    } else {
      setData(mockDatabase['All regions']);
    }
  }, [region]);

  const handleRefresh = (): void => {
    setIsRefreshing(true);
    setIsMenuOpen(false); // Otomatis tutup menu mobile saat diklik
    setTimeout(() => {
      updateTimestamp();
      setIsRefreshing(false);
    }, 600);
  };

  const handleReset = (): void => {
    setRegion('All regions');
    setYear('All years');
    setEvent('All events');
  };

  return (
    <div className={styles.container}>
      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.yellowIndicator} />
          <h1 className={styles.title}>Marketing Dashboard</h1>
        </div>

        {/* Tombol Hamburger dengan Animasi Garis */}
        <button
          className={`${styles.hamburgerBtn} ${isMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        {/* Menu Actions (Refresh, Time, Logo) */}
        <div className={`${styles.headerActions} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <span className={styles.updatedTime}>Updated {updatedTime}</span>
          <button
            className={styles.btnRefresh}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <span className={isRefreshing ? styles.spinIcon : ''}>↻</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Image
            src="/LinkNet-LOGO.png"
            alt="LinknetLogo"
            width={120}
            height={36}
            className={styles.logo}
            priority
          />
        </div>
      </header>

      {/* Control Bar (Filters) */}
      <section className={styles.filterBar}>
        <div className={styles.filtersGroup}>
          <div className={styles.filterControl}>
            <label className={styles.filterLabel}>REGION</label>
            <select
              className={styles.selectInput}
              value={region}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setRegion(e.target.value)}
            >
              <option value="All regions">All regions</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Surabaya">Surabaya</option>
            </select>
          </div>

          <div className={styles.filterControl}>
            <label className={styles.filterLabel}>YEAR</label>
            <select
              className={styles.selectInput}
              value={year}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setYear(e.target.value)}
            >
              <option value="All years">All years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className={styles.filterControl}>
            <label className={styles.filterLabel}>EVENT</label>
            <select
              className={styles.selectInput}
              value={event}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setEvent(e.target.value)}
            >
              <option value="All events">All events</option>
              <option value="Event 1">Event 1</option>
              <option value="Event 2">Event 2</option>
            </select>
          </div>
        </div>

        <button className={styles.btnReset} onClick={handleReset}>
          Reset filters
        </button>
      </section>

      {/* Banner Return Summary */}
      <div className={styles.highlightBanner}>
        <span className={styles.highlightText}>
          <strong>{data.mroi}</strong> return on <strong>{data.revenue}</strong> of measured event spend across <strong>{region === 'All regions' ? 'all' : data.eventsCount}</strong> events.
        </span>
      </div>

      {/* KPI Cards */}
      <section className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} />
            <span className={styles.cardTitle}>Total Event Cost</span>
            <span className={styles.cardSub}>{year}</span>
          </div>
          <div className={styles.cardValue}>{data.cost}</div>
          <div className={styles.cardFooter}>
            {region === 'All regions' ? 'all' : data.eventsCount} events have recorded cost
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} />
            <span className={styles.cardTitle}>Signing Ceremony Cost</span>
          </div>
          <div className={styles.cardValue}>{data.signingCost}</div>
          <div className={styles.cardFooter}>signing ceremonies</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} />
            <span className={styles.cardTitle}>Total Leads</span>
            <span className={styles.cardSub}>{year}</span>
          </div>
          <div className={styles.cardValue}>{data.leads}</div>
          <div className={styles.cardFooter}>company leads</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} />
            <span className={styles.cardTitle}>Total Revenue</span>
            <span className={styles.cardSub}>{year}</span>
          </div>
          <div className={styles.cardValue}>{data.revenue}</div>
          <div className={styles.cardFooter}>{data.revenue}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} />
            <span className={styles.cardTitle}>Overall MROI</span>
            <span className={styles.cardSub}>{year}</span>
          </div>
          <div className={styles.cardValue}>{data.mroi}</div>
          <div>
            <span className={styles.tagHighlight}>
              full cost coverage · {region === 'All regions' ? 'all' : data.eventsCount} events
            </span>
          </div>
        </div>
      </section>

      {/* Dual Charts Area */}
      <section className={styles.chartsGrid}>
        {/* Revenue per Event */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Revenue per Event</h3>
          <p className={styles.chartSubtitle}>Sorted by revenue; cost & MROI labelled per event</p>
          <div className={styles.barList}>
            {data.events.map((item: EventData, idx: number) => (
              <div key={idx} className={styles.barRow}>
                <span className={styles.barLabel}>{item.name}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.value}%` }} />
                </div>
                <span className={styles.barMeta}>{item.mroi} · {item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MROI by Event */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>MROI by Event</h3>
          <p className={styles.chartSubtitle}>(Revenue ÷ Cost) - 1, log scale; events without a cost are omitted</p>
          <div className={styles.barList}>
            {data.events.map((item: EventData, idx: number) => (
              <div key={idx} className={styles.barRow}>
                <span className={styles.barLabel}>{item.name}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.mroiValue}%` }} />
                </div>
                <span className={styles.barMeta}>{item.mroi}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Mix Donut Chart */}
      <section className={styles.fullCard}>
        <h3 className={styles.chartTitle}>Revenue by Product Mix</h3>
        <p className={styles.chartSubtitle}>Wholesale vs B2S/OA revenue across filtered events</p>

        <div className={styles.donutContainer}>
          <div className={styles.donutWrapper}>
            <svg viewBox="0 0 36 36" className={styles.donutSvg} width="100%" height="100%">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#d97706"
                strokeWidth="7"
                strokeDasharray="30, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f5b014"
                strokeWidth="7"
                strokeDasharray="70, 100"
                strokeDashoffset="-30"
              />
            </svg>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendSquareYellow} />
              <span>Wholesale</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendSquareOrange} />
              <span>B2S/OA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}