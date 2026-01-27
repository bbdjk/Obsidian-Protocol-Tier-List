/* ==========================================
   설정 구역
   ========================================== */
const imageBaseFolder = "./images/"; 
const fileExtension = ".png"; 
const totalImages = 1000; 

let currentCategory = 'UN'; 

/* ==========================================
   초기 실행
   ========================================== */
window.onload = function() {
    changeCategory('UN');
};

/* ==========================================
   [수정됨] 카테고리 변경 (창고 전용 ID 부여)
   ========================================== */
function changeCategory(category) {
    currentCategory = category;
    const bankContent = document.getElementById("bank-content");
    
    bankContent.innerHTML = "";
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${category}`).classList.add('active');

    for (let i = 0; i < totalImages; i++) { 
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        let fullPath = `${imageBaseFolder}${category}/${fileName}`;
        
        // ★ 핵심 1: 창고에 있는 아이템은 'bank_' 라는 꼬리표를 붙임
        let bankId = `bank_${category}_${formattedNumber}`;

        // 이미지 생성 (helper 함수 사용)
        let img = createImgElement(fullPath, bankId);
        
        // 창고 아이템은 숨김 처리 로직 유지
        img.onerror = function() { this.style.display = "none"; };

        bankContent.appendChild(img);
    }
}

/* ==========================================
   [추가됨] 이미지 생성 도우미 함수 (중복 코드 제거)
   ========================================== */
function createImgElement(src, id) {
    let img = document.createElement("img");
    img.src = src;
    img.id = id; 
    img.draggable = true;
    
    // 스타일 설정
    img.style.width = "100px";
    img.style.height = "auto";
    img.style.cursor = "pointer";
    img.style.border = "2px solid transparent";
    img.style.flexShrink = "0"; 

    // 이벤트 연결
    img.onmouseover = function() { this.style.border = "2px solid white"; };
    img.onmouseout = function() { this.style.border = "2px solid transparent"; };
    img.onclick = function() { openModal(this.src); }; // 클릭 시 확대
    img.ondragstart = drag;

    return img;
}

/* ==========================================
   드래그 시작
   ========================================== */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

/* ==========================================
   [수정됨] 드롭 기능 (복제 로직 추가)
   ========================================== */
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    
    if (!draggedElement) return;

    // ★ 핵심 2: '창고(bank_)'에서 온 녀석이면 -> 복제본을 만듦
    if (draggedElement.id.startsWith("bank_")) {
        // 원본 이미지는 그대로 두고, 복사본을 생성
        var clone = createImgElement(draggedElement.src, "placed_" + new Date().getTime() + Math.random());
        
        // 복제본을 드롭 위치에 추가
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(clone, ev.target);
        } else {
            ev.target.appendChild(clone);
        }
    } 
    // ★ 이미 티어리스트에 있는 녀석이면 -> 그냥 이동
    else {
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(draggedElement, ev.target);
        } else {
            ev.target.appendChild(draggedElement);
        }
    }
}

/* ==========================================
   기능: 이미지로 저장 (촬영용 세트장 방식)
   ========================================== */
function saveTierList() {
    const originalPanel = document.querySelector(".left-panel");
    const btn = document.querySelector(".save-btn");
    const originalText = btn.innerText;

    btn.innerText = "이미지 생성 중...";
    btn.disabled = true;

    // 1. 촬영용 세트장 복제
    const clone = originalPanel.cloneNode(true);

    // 2. 세트장 스타일 설정
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "-9999px";
    clone.style.zIndex = "-1";
    clone.style.width = "1280px"; // 표준 해상도 고정
    clone.style.height = "auto";
    clone.style.overflow = "visible";
    clone.style.backgroundColor = "#222";

    // 3. 내부 요소 줄바꿈 강제 적용
    const rows = clone.querySelectorAll(".tier-row");
    rows.forEach(row => {
        row.style.height = "auto";
        row.style.minHeight = "150px";
        row.style.alignItems = "stretch";
    });

    const contents = clone.querySelectorAll(".tier-content");
    contents.forEach(content => {
        content.style.flexWrap = "wrap";      // 줄바꿈 허용
        content.style.overflow = "visible";   // 스크롤 제거
        content.style.height = "auto";
        content.style.display = "flex";
        content.style.justifyContent = "flex-start";
    });

    document.body.appendChild(clone);

    // 4. 촬영
    html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#222",
        scrollY: -window.scrollY
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = 'obsidian-tier-list.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        document.body.removeChild(clone);
        btn.innerText = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("저장 실패:", err);
        if(document.body.contains(clone)) document.body.removeChild(clone);
        alert("저장 중 오류가 발생했습니다.");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

/* ==========================================
   기능: 모달 (확대)
   ========================================== */
function openModal(src) {
    document.getElementById("image-modal").style.display = "flex";
    document.getElementById("modal-img").src = src;
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}