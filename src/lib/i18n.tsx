'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from './theme';

export type Language = 'en' | 'zh' | 'hi' | 'ja' | 'ru' | 'es' | 'pt' | 'ko' | 'ar' | 'fr';

interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Game
    'game.title': 'O X O',
    'game.subtitle': 'CAMBRIDGE 1952',
    'game.wins': 'WINS',
    'game.losses': 'LOSSES',
    'game.games': 'GAMES',
    'game.computing': 'COMPUTING',
    'game.dial': 'DIAL 1-9',
    'game.draw': 'DRAW = VICTORY',
    'game.victory': 'VICTORY',
    'game.machine_wins': 'MACHINE WINS',
    'game.draw_human': 'DRAW = HUMAN VICTORY',
    'game.level': 'LEVEL',
    'game.music': 'MUSIC',
    'game.new': 'NEW',
    'game.reset': 'RESET',
    'game.vol': 'VOL',
    'game.computing_machine': 'COMPUTING MACHINE',
    'game.rotary_input': 'ROTARY INPUT',
    // History
    'history.title': 'HISTORY',
    'history.edsac': 'EDSAC',
    'history.first_game': 'FIRST VIDEO GAME',
    'history.year': '1952',
    'history.cambridge': 'University of Cambridge',
    'history.creator': 'Created by Alexander Douglas',
    'history.thesis': 'PhD thesis on human-computer interaction',
    'history.about': 'OXO was the first graphical computer game. It ran on EDSAC, one of the first stored-program computers.',
    // Online
    'online.title': 'ONLINE',
    'online.matchmaking': 'MATCHMAKING',
    'online.find_opponent': 'FIND OPPONENT',
    'online.searching': 'SEARCHING',
    'online.leaderboard': 'LEADERBOARD',
    'online.tournaments': 'TOURNAMENTS',
    'online.join': 'JOIN',
    'online.players': 'PLAYERS',
    'online.rank': 'RANK',
    'online.wins_stat': 'W',
    // Navigation
    'nav.history': 'HISTORY',
    'nav.game': 'GAME',
    'nav.online': 'ONLINE',
  },
  zh: {
    'game.title': 'O X O',
    'game.subtitle': '剑桥 1952',
    'game.wins': '胜利',
    'game.losses': '失败',
    'game.games': '游戏',
    'game.computing': '计算中',
    'game.dial': '拨号 1-9',
    'game.draw': '平局 = 胜利',
    'game.victory': '胜利',
    'game.machine_wins': '机器获胜',
    'game.draw_human': '平局 = 人类胜利',
    'game.level': '等级',
    'game.music': '音乐',
    'game.new': '新游戏',
    'game.reset': '重置',
    'game.vol': '音量',
    'game.computing_machine': '计算机',
    'game.rotary_input': '旋转输入',
    'history.title': '历史',
    'history.edsac': 'EDSAC',
    'history.first_game': '第一个视频游戏',
    'history.year': '1952',
    'history.cambridge': '剑桥大学',
    'history.creator': '亚历山大·道格拉斯创建',
    'history.thesis': '人机交互博士论文',
    'history.about': 'OXO是第一个图形电脑游戏。它在EDSAC上运行。',
    'online.title': '在线',
    'online.matchmaking': '匹配',
    'online.find_opponent': '寻找对手',
    'online.searching': '搜索中',
    'online.leaderboard': '排行榜',
    'online.tournaments': '锦标赛',
    'online.join': '加入',
    'online.players': '玩家',
    'online.rank': '排名',
    'online.wins_stat': '胜',
    'nav.history': '历史',
    'nav.game': '游戏',
    'nav.online': '在线',
  },
  hi: {
    'game.title': 'O X O',
    'game.subtitle': 'कैम्ब्रिज 1952',
    'game.wins': 'जीत',
    'game.losses': 'हार',
    'game.games': 'खेल',
    'game.computing': 'गणना',
    'game.dial': 'डायल 1-9',
    'game.draw': 'ड्रॉ = जीत',
    'game.victory': 'जीत',
    'game.machine_wins': 'मशीन जीती',
    'game.draw_human': 'ड्रॉ = मानव जीत',
    'game.level': 'स्तर',
    'game.music': 'संगीत',
    'game.new': 'नया',
    'game.reset': 'रीसेट',
    'game.vol': 'आवाज़',
    'game.computing_machine': 'कंप्यूटिंग मशीन',
    'game.rotary_input': 'रोटरी इनपुट',
    'history.title': 'इतिहास',
    'history.edsac': 'EDSAC',
    'history.first_game': 'पहला वीडियो गेम',
    'history.year': '1952',
    'history.cambridge': 'कैम्ब्रिज विश्वविद्यालय',
    'history.creator': 'अलेक्जेंडर डगलस द्वारा बनाया',
    'history.thesis': 'मानव-कंप्यूटर इंटरैक्शन पर थीसिस',
    'history.about': 'OXO पहला ग्राफिकल कंप्यूटर गेम था।',
    'online.title': 'ऑनलाइन',
    'online.matchmaking': 'मैचमेकिंग',
    'online.find_opponent': 'प्रतिद्वंद्वी खोजें',
    'online.searching': 'खोज रहे हैं',
    'online.leaderboard': 'लीडरबोर्ड',
    'online.tournaments': 'टूर्नामेंट',
    'online.join': 'शामिल हों',
    'online.players': 'खिलाड़ी',
    'online.rank': 'रैंक',
    'online.wins_stat': 'जी',
    'nav.history': 'इतिहास',
    'nav.game': 'खेल',
    'nav.online': 'ऑनलाइन',
  },
  ja: {
    'game.title': 'O X O',
    'game.subtitle': 'ケンブリッジ 1952',
    'game.wins': '勝利',
    'game.losses': '敗北',
    'game.games': 'ゲーム',
    'game.computing': '計算中',
    'game.dial': 'ダイヤル 1-9',
    'game.draw': '引分 = 勝利',
    'game.victory': '勝利',
    'game.machine_wins': 'マシンの勝ち',
    'game.draw_human': '引分 = 人間の勝利',
    'game.level': 'レベル',
    'game.music': '音楽',
    'game.new': '新規',
    'game.reset': 'リセット',
    'game.vol': '音量',
    'game.computing_machine': 'コンピュータ',
    'game.rotary_input': 'ロータリー入力',
    'history.title': '歴史',
    'history.edsac': 'EDSAC',
    'history.first_game': '最初のビデオゲーム',
    'history.year': '1952',
    'history.cambridge': 'ケンブリッジ大学',
    'history.creator': 'アレクサンダー・ダグラス作',
    'history.thesis': '人間とコンピュータの相互作用に関する論文',
    'history.about': 'OXOは最初のグラフィカルコンピュータゲームでした。',
    'online.title': 'オンライン',
    'online.matchmaking': 'マッチメイキング',
    'online.find_opponent': '対戦相手を探す',
    'online.searching': '検索中',
    'online.leaderboard': 'リーダーボード',
    'online.tournaments': 'トーナメント',
    'online.join': '参加',
    'online.players': 'プレイヤー',
    'online.rank': 'ランク',
    'online.wins_stat': '勝',
    'nav.history': '歴史',
    'nav.game': 'ゲーム',
    'nav.online': 'オンライン',
  },
  ru: {
    'game.title': 'O X O',
    'game.subtitle': 'КЕМБРИДЖ 1952',
    'game.wins': 'ПОБЕДЫ',
    'game.losses': 'ПОРАЖЕНИЯ',
    'game.games': 'ИГРЫ',
    'game.computing': 'ВЫЧИСЛЕНИЕ',
    'game.dial': 'НАБЕРИ 1-9',
    'game.draw': 'НИЧЬЯ = ПОБЕДА',
    'game.victory': 'ПОБЕДА',
    'game.machine_wins': 'МАШИНА ПОБЕДИЛА',
    'game.draw_human': 'НИЧЬЯ = ПОБЕДА ЧЕЛОВЕКА',
    'game.level': 'УРОВЕНЬ',
    'game.music': 'МУЗЫКА',
    'game.new': 'НОВАЯ',
    'game.reset': 'СБРОС',
    'game.vol': 'ЗВУК',
    'game.computing_machine': 'ВЫЧИСЛИТЕЛЬНАЯ МАШИНА',
    'game.rotary_input': 'ДИСКОВЫЙ НАБОР',
    'history.title': 'ИСТОРИЯ',
    'history.edsac': 'EDSAC',
    'history.first_game': 'ПЕРВАЯ ВИДЕОИГРА',
    'history.year': '1952',
    'history.cambridge': 'Кембриджский университет',
    'history.creator': 'Создал Александр Дуглас',
    'history.thesis': 'Диссертация о взаимодействии человека и компьютера',
    'history.about': 'OXO — первая графическая компьютерная игра. Работала на EDSAC.',
    'online.title': 'ОНЛАЙН',
    'online.matchmaking': 'ПОИСК ИГРЫ',
    'online.find_opponent': 'НАЙТИ СОПЕРНИКА',
    'online.searching': 'ПОИСК',
    'online.leaderboard': 'РЕЙТИНГ',
    'online.tournaments': 'ТУРНИРЫ',
    'online.join': 'ВОЙТИ',
    'online.players': 'ИГРОКИ',
    'online.rank': 'МЕСТО',
    'online.wins_stat': 'П',
    'nav.history': 'ИСТОРИЯ',
    'nav.game': 'ИГРА',
    'nav.online': 'ОНЛАЙН',
  },
  es: {
    'game.title': 'O X O',
    'game.subtitle': 'CAMBRIDGE 1952',
    'game.wins': 'VICTORIAS',
    'game.losses': 'DERROTAS',
    'game.games': 'JUEGOS',
    'game.computing': 'CALCULANDO',
    'game.dial': 'MARCA 1-9',
    'game.draw': 'EMPATE = VICTORIA',
    'game.victory': 'VICTORIA',
    'game.machine_wins': 'GANA LA MÁQUINA',
    'game.draw_human': 'EMPATE = VICTORIA HUMANA',
    'game.level': 'NIVEL',
    'game.music': 'MÚSICA',
    'game.new': 'NUEVO',
    'game.reset': 'REINICIAR',
    'game.vol': 'VOL',
    'game.computing_machine': 'MÁQUINA',
    'game.rotary_input': 'ENTRADA ROTATIVA',
    'history.title': 'HISTORIA',
    'history.edsac': 'EDSAC',
    'history.first_game': 'PRIMER VIDEOJUEGO',
    'history.year': '1952',
    'history.cambridge': 'Universidad de Cambridge',
    'history.creator': 'Creado por Alexander Douglas',
    'history.thesis': 'Tesis sobre interacción humano-computadora',
    'history.about': 'OXO fue el primer juego gráfico de computadora.',
    'online.title': 'EN LÍNEA',
    'online.matchmaking': 'EMPAREJAMIENTO',
    'online.find_opponent': 'BUSCAR OPONENTE',
    'online.searching': 'BUSCANDO',
    'online.leaderboard': 'CLASIFICACIÓN',
    'online.tournaments': 'TORNEOS',
    'online.join': 'UNIRSE',
    'online.players': 'JUGADORES',
    'online.rank': 'RANGO',
    'online.wins_stat': 'V',
    'nav.history': 'HISTORIA',
    'nav.game': 'JUEGO',
    'nav.online': 'EN LÍNEA',
  },
  pt: {
    'game.title': 'O X O',
    'game.subtitle': 'CAMBRIDGE 1952',
    'game.wins': 'VITÓRIAS',
    'game.losses': 'DERROTAS',
    'game.games': 'JOGOS',
    'game.computing': 'CALCULANDO',
    'game.dial': 'DISQUE 1-9',
    'game.draw': 'EMPATE = VITÓRIA',
    'game.victory': 'VITÓRIA',
    'game.machine_wins': 'MÁQUINA VENCE',
    'game.draw_human': 'EMPATE = VITÓRIA HUMANA',
    'game.level': 'NÍVEL',
    'game.music': 'MÚSICA',
    'game.new': 'NOVO',
    'game.reset': 'REINICIAR',
    'game.vol': 'VOL',
    'game.computing_machine': 'MÁQUINA',
    'game.rotary_input': 'ENTRADA ROTATIVA',
    'history.title': 'HISTÓRIA',
    'history.edsac': 'EDSAC',
    'history.first_game': 'PRIMEIRO VIDEOGAME',
    'history.year': '1952',
    'history.cambridge': 'Universidade de Cambridge',
    'history.creator': 'Criado por Alexander Douglas',
    'history.thesis': 'Tese sobre interação humano-computador',
    'history.about': 'OXO foi o primeiro jogo gráfico de computador.',
    'online.title': 'ONLINE',
    'online.matchmaking': 'BUSCA',
    'online.find_opponent': 'ENCONTRAR OPONENTE',
    'online.searching': 'PROCURANDO',
    'online.leaderboard': 'RANKING',
    'online.tournaments': 'TORNEIOS',
    'online.join': 'ENTRAR',
    'online.players': 'JOGADORES',
    'online.rank': 'POSIÇÃO',
    'online.wins_stat': 'V',
    'nav.history': 'HISTÓRIA',
    'nav.game': 'JOGO',
    'nav.online': 'ONLINE',
  },
  ko: {
    'game.title': 'O X O',
    'game.subtitle': '케임브리지 1952',
    'game.wins': '승리',
    'game.losses': '패배',
    'game.games': '게임',
    'game.computing': '계산중',
    'game.dial': '다이얼 1-9',
    'game.draw': '무승부 = 승리',
    'game.victory': '승리',
    'game.machine_wins': '기계 승리',
    'game.draw_human': '무승부 = 인간 승리',
    'game.level': '레벨',
    'game.music': '음악',
    'game.new': '새 게임',
    'game.reset': '리셋',
    'game.vol': '음량',
    'game.computing_machine': '컴퓨터',
    'game.rotary_input': '로터리 입력',
    'history.title': '역사',
    'history.edsac': 'EDSAC',
    'history.first_game': '최초의 비디오 게임',
    'history.year': '1952',
    'history.cambridge': '케임브리지 대학교',
    'history.creator': '알렉산더 더글라스 제작',
    'history.thesis': '인간-컴퓨터 상호작용 논문',
    'history.about': 'OXO는 최초의 그래픽 컴퓨터 게임이었습니다.',
    'online.title': '온라인',
    'online.matchmaking': '매치메이킹',
    'online.find_opponent': '상대 찾기',
    'online.searching': '검색중',
    'online.leaderboard': '리더보드',
    'online.tournaments': '토너먼트',
    'online.join': '참가',
    'online.players': '플레이어',
    'online.rank': '순위',
    'online.wins_stat': '승',
    'nav.history': '역사',
    'nav.game': '게임',
    'nav.online': '온라인',
  },
  ar: {
    'game.title': 'O X O',
    'game.subtitle': 'كامبريدج 1952',
    'game.wins': 'فوز',
    'game.losses': 'خسارة',
    'game.games': 'ألعاب',
    'game.computing': 'يحسب',
    'game.dial': 'اطلب 1-9',
    'game.draw': 'تعادل = فوز',
    'game.victory': 'فوز',
    'game.machine_wins': 'فازت الآلة',
    'game.draw_human': 'تعادل = فوز الإنسان',
    'game.level': 'مستوى',
    'game.music': 'موسيقى',
    'game.new': 'جديد',
    'game.reset': 'إعادة',
    'game.vol': 'صوت',
    'game.computing_machine': 'آلة حاسبة',
    'game.rotary_input': 'إدخال دوار',
    'history.title': 'التاريخ',
    'history.edsac': 'EDSAC',
    'history.first_game': 'أول لعبة فيديو',
    'history.year': '1952',
    'history.cambridge': 'جامعة كامبريدج',
    'history.creator': 'من إنشاء ألكسندر دوغلاس',
    'history.thesis': 'أطروحة عن تفاعل الإنسان والحاسوب',
    'history.about': 'OXO كانت أول لعبة حاسوب رسومية.',
    'online.title': 'اونلاين',
    'online.matchmaking': 'البحث',
    'online.find_opponent': 'ابحث عن خصم',
    'online.searching': 'يبحث',
    'online.leaderboard': 'المتصدرين',
    'online.tournaments': 'البطولات',
    'online.join': 'انضم',
    'online.players': 'لاعبين',
    'online.rank': 'ترتيب',
    'online.wins_stat': 'ف',
    'nav.history': 'تاريخ',
    'nav.game': 'لعبة',
    'nav.online': 'اونلاين',
  },
  fr: {
    'game.title': 'O X O',
    'game.subtitle': 'CAMBRIDGE 1952',
    'game.wins': 'VICTOIRES',
    'game.losses': 'DÉFAITES',
    'game.games': 'PARTIES',
    'game.computing': 'CALCUL',
    'game.dial': 'COMPOSEZ 1-9',
    'game.draw': 'NUL = VICTOIRE',
    'game.victory': 'VICTOIRE',
    'game.machine_wins': 'MACHINE GAGNE',
    'game.draw_human': 'NUL = VICTOIRE HUMAINE',
    'game.level': 'NIVEAU',
    'game.music': 'MUSIQUE',
    'game.new': 'NOUVEAU',
    'game.reset': 'RÉINITIALISER',
    'game.vol': 'VOL',
    'game.computing_machine': 'MACHINE',
    'game.rotary_input': 'ENTRÉE ROTATIVE',
    'history.title': 'HISTOIRE',
    'history.edsac': 'EDSAC',
    'history.first_game': 'PREMIER JEU VIDÉO',
    'history.year': '1952',
    'history.cambridge': 'Université de Cambridge',
    'history.creator': 'Créé par Alexander Douglas',
    'history.thesis': 'Thèse sur l\'interaction homme-machine',
    'history.about': 'OXO était le premier jeu graphique informatique.',
    'online.title': 'EN LIGNE',
    'online.matchmaking': 'MATCHMAKING',
    'online.find_opponent': 'TROUVER ADVERSAIRE',
    'online.searching': 'RECHERCHE',
    'online.leaderboard': 'CLASSEMENT',
    'online.tournaments': 'TOURNOIS',
    'online.join': 'REJOINDRE',
    'online.players': 'JOUEURS',
    'online.rank': 'RANG',
    'online.wins_stat': 'V',
    'nav.history': 'HISTOIRE',
    'nav.game': 'JEU',
    'nav.online': 'EN LIGNE',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLang: LanguageInfo;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  currentLang: LANGUAGES[0],
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('oxo-language') as Language | null;
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.split('-')[0] as Language;
      if (LANGUAGES.some(l => l.code === browserLang)) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('oxo-language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, currentLang }}>
      {children}
    </I18nContext.Provider>
  );
}

// Language selector component - cycles through languages on click
export function LanguageToggle() {
  const { currentLang, setLanguage, language } = useI18n();
  const { colors } = useTheme();

  const cycleLanguage = () => {
    const currentIndex = LANGUAGES.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex].code);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        cycleLanguage();
      }}
      className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${colors.metalLight}, ${colors.metalDark})`,
        border: `3px solid ${colors.primary}`,
        boxShadow: `0 0 12px ${colors.primaryGlow}, 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
      title={currentLang.name}
    >
      <span className="text-lg">{currentLang.flag}</span>
    </button>
  );
}
