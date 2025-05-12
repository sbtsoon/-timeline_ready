// data.js
// 전역 변수 방식: modules 없이 전역으로 노출

window.START_DATE = new Date('2023-01-01');
window.END_DATE   = new Date('2025-05-31');
window.MS_PER_DAY = 1000 * 60 * 60 * 24;
window.STEP_DAYS  = 14;
window.totalSteps = Math.ceil((window.END_DATE - window.START_DATE) / (window.MS_PER_DAY * window.STEP_DAYS)) + 1;

// 이벤트 데이터
window.EVENTS = [
  { name: '가상 인프라구축 프로젝트 A',      start: '2023-02-15', end: '2023-03-15', type: '인프라구축', org: '경남TP' },
  { name: '부산TP 스마트물류 디지털전환',      start: '2023-05-01', end: '2023-06-01', type: '사업화지원', org: '부산TP' },
  { name: '대구TP 친환경 인프라 구축',        start: '2023-03-20', end: '2023-07-01', type: '인프라구축', org: '대구TP' },
  { name: '가상 기술개발 프로젝트 B',        start: '2023-07-10', end: '2023-08-10', type: '기술개발', org: '경남TP' },
  { name: '가상 사업화지원 프로젝트 C',       start: '2023-11-05', end: '2023-12-05', type: '사업화지원', org: '경남TP' },
  { name: '해양로봇 R&D 프로젝트',          start: '2023-09-01', end: '2024-02-28', type: '기술개발', org: '울산TP' },
  { name: 'AI로봇 제어시스템 개발',         start: '2024-01-15', end: '2024-04-15', type: '기술개발', org: '부산TP' },
  { name: '헬스케어 데이터 분석',           start: '2024-06-10', end: '2024-09-10', type: '사업화지원', org: '대구TP' },
  { name: 'VR교육 플랫폼 구축',            start: '2024-03-05', end: '2024-05-20', type: '사업화지원', org: '부산TP' },
  { name: '그린모빌리티 테스트베드',         start: '2024-08-01', end: '2024-11-30', type: '인프라구축', org: '대구TP' },
  { name: '스마트에너지 관리시스템',         start: '2024-04-15', end: '2024-12-15', type: '기술개발', org: '경남TP' },
  { name: 'AI농업 지원 플랫폼',            start: '2024-10-10', end: '2025-01-31', type: '사업화지원', org: '광주TP' },
  { name: '친환경 숙박 솔루션',             start: '2024-05-20', end: '2024-10-20', type: '인프라구축', org: '제주TP' },
  { name: '스마트시티 통합관제',            start: '2025-01-05', end: '2025-06-30', type: '인프라구축', org: '세종TP' },
  { name: '드론 물류 서비스 PoC',           start: '2025-02-15', end: '2025-07-15', type: '기술개발', org: '인천TP' },
  { name: '바이오케어 연구개발',            start: '2025-03-10', end: '2025-09-10', type: '기술개발', org: '전주TP' },
  { name: '관광 XR 경험 플랫폼',            start: '2025-04-01', end: '2025-10-01', type: '사업화지원', org: '춘천TP' },
  { name: '메타버스 기반 직무훈련센터 구축', start: '2025-06-01', end: '2025-12-31', type: '인프라구축', org: '경남TP' },
  { name: '농업용 드론기술 실증사업',       start: '2025-05-15', end: '2025-10-31', type: '기술개발', org: '경남TP' },
  { name: '디지털헬스 국제협력 사업',       start: '2025-04-20', end: '2025-11-30', type: '사업화지원', org: '경남TP' }
];

// 타입별 매핑 및 색상
window.baseColors = {
    '인프라구축': '#1f77b4',
    '기술개발':    '#2ca02c',
    '사업화지원':  '#ff7f0e',
    '기타':        '#999999'   // 네 번째 영역
  };

  window.typeMap = {
    '인프라구축': 0,
    '기술개발':   1,
    '사업화지원': 2,
    '기타':       3
  };

// 수행기관별 매핑 및 색상
window.orgMap = {
  '경남TP': 0,
  '부산TP': 1,
  '대구TP': 2,
  '울산TP': 3,
  '광주TP': 4,
  '제주TP': 5,
  '세종TP': 6,
  '인천TP': 7,
  '전주TP': 8,
  '춘천TP': 9
};
window.orgColors = {
  '경남TP': '#d62728',
  '부산TP': '#9467bd',
  '대구TP': '#8c564b',
  '울산TP': '#e377c2',
  '광주TP': '#17becf',
  '제주TP': '#bcbd22',
  '세종TP': '#7f7f7f',
  '인천TP': '#8c9eff',
  '전주TP': '#ff9896',
  '춘천TP': '#c5b0d5'
};
