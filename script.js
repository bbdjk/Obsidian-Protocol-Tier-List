/* ==========================================
   설정 구역
   ========================================== */
const imageBaseFolder = "./images/"; 
const fileExtension = ".png"; 

// ★ 가지고 있는 이미지 번호의 끝번호에 맞춰주세요!
const totalImages = 200; 

let currentCategory = 'UN'; 

/* ==========================================
   초기 실행
   ========================================== */
window.onload = function() {
    changeCategory('UN');
};

/* ==========================================
   카테고리 변경 함수 (이동 모드)
   ========================================== */
function changeCategory(category) {
    currentCategory = category;
    const bankContent = document.getElementById("bank-content");
    
    // 1. 목록 비우기
    bankContent.innerHTML = "";

    // 2. 버튼 활성화 표시
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${category}`).classList.add('active');

    // 3. 이미지 생성
    for (let i = 0; i < totalImages; i++) { 
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        let fullPath = `${imageBaseFolder}${category}/${fileName}`;
        
        let newId = `${category}_${formattedNumber}`;

        // ★ 티어리스트(화면 어딘가)에 이미 있으면 목록에 안 만듦
        if (document.getElementById(newId)) {
            continue; 
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
   드래그 시작
   ========================================== */
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

/* ==========================================
   드롭 기능 (단순 이동)
   ========================================== */
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
   [추가됨] 초기화(리셋) 기능
   ========================================== */
function resetTierList() {
    if (!confirm("정말 모든 배치를 초기화하시겠습니까?\n(티어리스트의 모든 부품이 목록으로 돌아갑니다)")) {
        return;
    }

    // 1. 모든 티어 구역(tier-content)을 비움
    const tierContents = document.querySelectorAll('.tier-content');
    tierContents.forEach(content => {
        content.innerHTML = ""; // 내용물 삭제 (DOM에서 제거됨)
    });

    // 2. 현재 카테고리 목록 새로고침
    // (DOM에서 제거되었으므로 changeCategory가 다시 목록에 생성함)
    changeCategory(currentCategory);
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

    // 촬영용 세트장 복제
    const clone = originalPanel.cloneNode(true);

    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "-9999px";
    clone.style.zIndex = "-1";
    clone.style.width = "1280px"; 
    clone.style.height = "auto";
    clone.style.overflow = "visible";
    clone.style.backgroundColor = "#222";

    const rows = clone.querySelectorAll(".tier-row");
    rows.forEach(row => {
        row.style.height = "auto";
        row.style.minHeight = "150px";
        row.style.alignItems = "stretch";
    });

    const contents = clone.querySelectorAll(".tier-content");
    contents.forEach(content => {
        content.style.flexWrap = "wrap";      
        content.style.overflow = "visible";   
        content.style.height = "auto";
        content.style.display = "flex";
        content.style.justifyContent = "flex-start";
    });

    document.body.appendChild(clone);

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