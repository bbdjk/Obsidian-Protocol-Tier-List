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
   카테고리 변경 함수
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
        
        let newId = `${category}_${formattedNumber}`;

        if (document.getElementById(newId)) {
            continue; // 중복 방지
        }

        let img = document.createElement("img");
        img.src = fullPath;
        img.id = newId; 
        img.draggable = true;
        img.alt = fileName;

        img.style.width = "100px";
        img.style.height = "auto";
        img.style.cursor = "pointer";
        img.style.border = "2px solid transparent";
        img.style.flexShrink = "0"; 

        img.onmouseover = function() { this.style.border = "2px solid white"; };
        img.onmouseout = function() { this.style.border = "2px solid transparent"; };
        img.onclick = function() { openModal(this.src); };
        img.ondragstart = drag;
        img.onerror = function() { this.style.display = "none"; };

        bankContent.appendChild(img);
    }
}

/* ==========================================
   드래그 앤 드롭
   ========================================== */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    
    if (draggedElement) {
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(draggedElement, ev.target);
        } else {
            ev.target.appendChild(draggedElement);
        }
    }
}

/* ==========================================
   [수정됨] 기능: 저장 (잘림 방지 및 템플릿화)
   ========================================== */
function saveTierList() {
    const captureArea = document.querySelector(".left-panel");
    const btn = document.querySelector(".save-btn");
    const originalText = btn.innerText;

    btn.innerText = "이미지 생성 중...";
    btn.disabled = true;

    html2canvas(captureArea, {
        scale: 2,               // 고화질
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#222",
        
        // ★ 핵심 1: 가상 브라우저 폭을 2000px로 설정하여 오른쪽 잘림 방지
        windowWidth: 2000, 
        
        // ★ 핵심 2: 캡처 직전, 복제된 요소를 '템플릿' 형태로 성형
        onclone: (clonedDoc) => {
            const clonedPanel = clonedDoc.querySelector(".left-panel");
            
            // 1. 패널 크기를 표준 규격(1280px)으로 고정
            clonedPanel.style.width = "1280px"; 
            clonedPanel.style.height = "auto";
            clonedPanel.style.overflow = "visible"; // 스크롤바 제거
            clonedPanel.style.position = "static";

            // 2. 각 티어 줄(Row) 스타일 수정
            const rows = clonedPanel.querySelectorAll('.tier-row');
            rows.forEach(row => {
                row.style.height = "auto";     // 높이 자동 늘어남
                row.style.minHeight = "150px"; 
                row.style.alignItems = "stretch"; // 라벨이 같이 늘어나도록
                row.style.flexWrap = "nowrap"; // 로우 자체는 감싸지 않음
            });

            // 3. 내용물(이미지) 구역 수정 -> 강제 줄바꿈
            const contents = clonedPanel.querySelectorAll('.tier-content');
            contents.forEach(content => {
                content.style.display = "flex";
                content.style.flexWrap = "wrap";     // ★ 핵심: 줄바꿈 허용
                content.style.overflow = "visible";  // 스크롤 제거
                content.style.height = "auto";       // 내용물만큼 늘어남
                content.style.justifyContent = "flex-start";
                content.style.alignContent = "flex-start"; // 위쪽부터 채움
            });
        }
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = 'obsidian-tier-list.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        btn.innerText = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error("저장 실패:", err);
        alert("저장 중 오류가 발생했습니다.");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

function openModal(src) {
    document.getElementById("image-modal").style.display = "flex";
    document.getElementById("modal-img").src = src;
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}