/* ==========================================
   설정 구역
   ========================================== */
const imageFolder = "./images/";
const fileExtension = ".png"; 
const totalImages = 500;  // 81번부터 200번까지

/* ==========================================
   이미지 자동 생성 로직
   ========================================== */
window.onload = function() {
    const bankContent = document.getElementById("bank-content");

    for (let i = 0; i < totalImages; i++) { 
        
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        
        let img = document.createElement("img");
        img.src = imageFolder + fileName;
        img.id = "img_" + formattedNumber; 
        img.draggable = true;
        img.alt = fileName;

        // ★ CSS 강제 적용 (지난번 수정사항 유지)
        img.style.width = "120px";
        img.style.height = "auto";
        img.style.maxHeight = "180px";
        img.style.margin = "5px";
        img.style.cursor = "pointer"; // 커서를 손가락 모양으로 변경
        img.style.border = "2px solid transparent";

        img.onmouseover = function() { this.style.border = "2px solid white"; };
        img.onmouseout = function() { this.style.border = "2px solid transparent"; };

        // ★ 클릭 시 확대 기능 연결
        img.onclick = function() {
            openModal(this.src);
        };

        img.ondragstart = drag;

        img.onerror = function() {
            this.style.display = "none";
        };

        bankContent.appendChild(img);
    }
};

/* ==========================================
   드래그 앤 드롭 기능
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
            ev.target.parentNode.appendChild(draggedElement);
        } else {
            ev.target.appendChild(draggedElement);
        }
    }
}

/* ==========================================
   추가 기능: 이미지 저장 & 확대 모달
   ========================================== */

// 1. 티어리스트 이미지로 저장하기
function saveTierList() {
    const captureArea = document.getElementById("capture-area");
    
    // html2canvas 라이브러리 사용
    html2canvas(captureArea, {
        backgroundColor: "#222" // 배경색 지정
    }).then(canvas => {
        // 가상의 링크를 만들어 다운로드 트리거
        const link = document.createElement("a");
        link.download = 'obsidian-tier-list.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 2. 모달 열기 (이미지 확대)
function openModal(src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    
    modal.style.display = "flex"; // 화면에 표시
    modalImg.src = src;           // 클릭한 이미지 주소 넣기
}

// 3. 모달 닫기 (배경 클릭 시)
function closeModal() {
    const modal = document.getElementById("image-modal");
    modal.style.display = "none"; // 화면에서 숨김
}