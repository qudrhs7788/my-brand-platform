/* 식자재 구매처 공개 정보. 각 항목은 출처(src)에서 확인한 내용만 적는다.
   갱신할 때는 checked 날짜와 함께 고친다. */
module.exports = {
  checked: "2026년 11월 13일",
  list: [
    {
      id: "foodspring", name: "식봄", operator: "마켓보로 (CJ프레시웨이 계열)", type: "오픈마켓",
      oneLine: "여러 유통사의 같은 상품을 판매자별 가격으로 비교해 주문하는 식자재 오픈마켓",
      facts: [
        ["규모", "입점 유통사 2,730곳 이상, 상품 22만 개 이상, 이용자 27만 명 이상 (자사 소개 기준)"],
        ["가격 비교", "중량·포장 단위가 같은 상품 20만여 개를 판매자별로 비교, 쿠폰 적용 최종가 표시"],
        ["배송", "판매자 직배송 또는 싱싱배송(여러 판매자 상품을 묶어 다음 날 한 번에 배송)"],
        ["싱싱배송 조건", "오후 4시 주문 마감, 월~토 다음 날 도착, 배송비 10,000원(10만원 이상 무료). 상품 페이지 표기 기준"],
        ["직배송 조건", "판매자마다 다름. 예: 7만원 또는 10만원 이상 무료배송, 주문 마감 시간도 판매자별"],
        ["보장", "첫 구매 불만족 시 보상, 신선 식자재 싱싱보장제 (자사 안내)"]
      ],
      fit: "여러 업체 가격을 한 번에 비교하고 싶을 때",
      link: ["식봄 소개 페이지", "https://www.foodspring.co.kr/event/about"],
      src: [["식봄 소개", "https://www.foodspring.co.kr/event/about"], ["한국금융신문 2026.10", "https://www.fntimes.com/html/view.php?ud=202610081058286963923defd0cc_18"]],
      rating: null
    },
    {
      id: "orderplus", name: "오더플러스", operator: "(주)오더플러스", type: "비교 주문 중개",
      oneLine: "대기업·전문 유통사·도매시장 상품을 비교해 주문하고, 담당 MD가 유통사를 추천",
      facts: [
        ["규모", "업소용 식자재 21만 2천 가지 비교 주문 (앱 소개 기준)"],
        ["상담", "매장 사용량과 예산에 맞춰 담당 MD가 유통사와 상품을 추천"],
        ["가격 정보", "자주 사는 식재료의 이전 가격과 변동 확인"],
        ["배송", "공급 업체가 배송. 일부 지역은 이용 제한"],
        ["문의", "02-6404-1020"]
      ],
      fit: "거래처를 처음 구하거나 상담을 받으며 고르고 싶을 때",
      link: ["App Store 페이지", "https://apps.apple.com/kr/app/id1216541676"],
      src: [["App Store 앱 소개", "https://apps.apple.com/kr/app/id1216541676"], ["Google Play 앱 소개", "https://play.google.com/store/apps/details?id=kr.co.xbarx.ohpl&hl=ko&gl=US"]],
      rating: ["App Store", "4.1", "45"]
    },
    {
      id: "baemin", name: "배민상회", operator: "우아한형제들 (배달의민족)", type: "종합몰",
      oneLine: "배달 용기 같은 비품과 식재료를 함께 사는 외식업 종합몰",
      facts: [
        ["취급", "배달 비품(용기, 소스컵 등)과 쌀·신선 식재료·가공식품"],
        ["소량 구매", "비품을 1줄, 반 박스 단위로 구매 가능. 업종별 샘플팩 운영"],
        ["배송", "신선 식재료는 냉장·냉동 탑차 직배송(콜드배송)"],
        ["혜택", "가입 쿠폰팩, 주문 실적에 따른 등급 쿠폰 (앱 소개 기준, 금액은 수시 변경)"],
        ["문의", "1600-4949"]
      ],
      fit: "배달 장사라 용기와 식재료를 한 곳에서 사고 싶을 때",
      link: ["App Store 페이지", "https://apps.apple.com/kr/app/%EB%B0%B0%EB%AF%BC%EC%83%81%ED%9A%8C-%EC%99%B8%EC%8B%9D%EC%97%85-%EC%8B%9D%EC%9E%90%EC%9E%AC-%EC%A2%85%ED%95%A9%EB%AA%B0/id1532332276?l=ko"],
      src: [["App Store 앱 소개", "https://apps.apple.com/kr/app/%EB%B0%B0%EB%AF%BC%EC%83%81%ED%9A%8C-%EC%99%B8%EC%8B%9D%EC%97%85-%EC%8B%9D%EC%9E%90%EC%9E%AC-%EC%A2%85%ED%95%A9%EB%AA%B0/id1532332276?l=ko"]],
      rating: ["App Store", "3.9", "33"]
    },
    {
      id: "foodpang", name: "푸드팡", operator: "푸드팡", type: "도매시장 직거래",
      oneLine: "농산물 도매시장 중매인 직거래를 내세우는 식당 전용 주문 앱",
      facts: [
        ["취급", "농산물부터 공산품까지. 매일 바뀌는 도매시장 시세로 판매"],
        ["배송", "가게 냉장고 안까지 배송 (출입 정보 필요, 가정집 불가)"],
        ["교환·환불", "품질 문제 시 100% 교환·환불 (앱 소개 기준)"],
        ["고객센터", "평일 24시간 운영, 토요일 18시~일요일 20시 휴무. 1577-2150"],
        ["참고", "식봄에도 '푸드팡-수도권' 판매자로 입점"]
      ],
      fit: "채소·과일 같은 농산물 비중이 높은 가게",
      link: ["App Store 페이지", "https://apps.apple.com/app/id1366159625"],
      src: [["App Store 앱 소개", "https://apps.apple.com/app/id1366159625"], ["식봄 판매자 페이지", "https://www.foodspring.co.kr/seller/5081"]],
      rating: null
    },
    {
      id: "ewang", name: "식자재왕몰", operator: "푸디스트", type: "식자재마트 온라인몰",
      oneLine: "식자재왕 마트의 온라인몰. 당일배송과 아침 배송을 운영",
      facts: [
        ["당일배송", "하루 세 번 당일배송 (앱 소개 기준)"],
        ["굿모닝배송", "밤 10시 전 주문하면 다음 날 아침 도착. 서울 전역과 경기·인천"],
        ["혜택", "가입 혜택과 사업자 등록 시 추가 혜택 (금액은 수시 변경)"]
      ],
      fit: "수도권에서 급하게 당일이나 다음 날 아침에 받아야 할 때",
      link: ["App Store 페이지", "https://apps.apple.com/kr/app/%EC%8B%9D%EC%9E%90%EC%9E%AC%EC%99%95%EB%AA%B0/id1565932454"],
      src: [["App Store 앱 소개", "https://apps.apple.com/kr/app/%EC%8B%9D%EC%9E%90%EC%9E%AC%EC%99%95%EB%AA%B0/id1565932454"]],
      rating: ["App Store", "3.1", "44"]
    },
    {
      id: "beston", name: "베스트온", operator: "대상", type: "식자재마트 온라인몰",
      oneLine: "청정원의 대상이 운영하는 식자재 전문 쇼핑몰",
      facts: [
        ["당일배송", "낮 12시 이전 주문 시 당일 배송 (앱 소개 기준)"],
        ["신선 관리", "신선 유지 차량으로 배송"],
        ["대량 주문", "고객센터에 문의하면 해당 지역 마트에서 안내"],
        ["문의", "080-851-1220"]
      ],
      fit: "오전에 주문해 그날 받고 싶을 때. 배송 가능 지역은 앱에서 확인 필요",
      link: ["App Store 페이지", "https://apps.apple.com/kr/app/id1600412775"],
      src: [["App Store 앱 소개", "https://apps.apple.com/kr/app/id1600412775"]],
      rating: ["App Store", "평가 8개로 평균 미표시", ""]
    },
    {
      id: "cjfw", name: "CJ프레시웨이 (프레시엔 · 오늘얼마 식자재몰)", operator: "CJ프레시웨이", type: "대기업 직영몰",
      oneLine: "CJ프레시웨이가 직접 파는 온라인 창구. 자사몰 프레시엔과 매출관리 앱 '오늘얼마' 안의 식자재몰",
      facts: [
        ["프레시엔", "외식업자 전용 자사몰. 자체 브랜드와 대용량 상품 중심, 전국 콜드체인 배송 (2025년 보도 기준)"],
        ["오늘얼마 식자재몰", "월~금 오후 5시까지 결제하면 다음 날 배송. 사업장만 배송, 주택·아파트는 불가"],
        ["취소", "오늘얼마 식자재몰은 오후 5시 주문 마감 전까지 취소 가능"],
        ["고객센터", "080-120-1200. 평일 08:30~17:30, 토요일 08:30~12:00"],
        ["참고", "식봄에서도 CJ프레시웨이 상품을 판매"]
      ],
      fit: "대기업 상품을 고정으로 받고 싶을 때",
      link: ["오늘얼마 식자재몰 안내", "https://docs.channel.io/todayhelpcenter/ko/articles/%EC%8B%9D%EC%9E%90%EC%9E%AC%EB%AA%B0-FAQ-46bf724e"],
      src: [["오늘얼마 고객센터 FAQ", "https://docs.channel.io/todayhelpcenter/ko/articles/%EC%8B%9D%EC%9E%90%EC%9E%AC%EB%AA%B0-FAQ-46bf724e"], ["비즈워치 2025.08", "https://news.bizwatch.co.kr/article/consumer/2025/08/28/0003"]],
      rating: null
    }
  ]
};
