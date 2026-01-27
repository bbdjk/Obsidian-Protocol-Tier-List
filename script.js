/* ==========================================
   설정 구역
   ========================================== */
const imageFolder = "./images/";
const fileExtension = ".png"; 
const totalImages = 500; 

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

        // ★ CSS 강제 적용 (가로 스크롤 시 찌그러짐 방지 추가)
        img.style.width = "120px";
        img.style.height = "auto";
        img.style.maxHeight = "180px";
        img.style.margin = "5px";
        img.style.cursor = "pointer";
        img.style.border = "2px solid transparent";
        img.style.flexShrink = "0"; // ★ [추가됨] 가로 스크롤에서 이미지 찌그러짐 방지

        img.onmouseover = function() { this.style.border = "2px solid white"; };
        img.onmouseout = function() { this.style.border = "2px solid transparent"; };

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
        // 이미지를 다른 이미지 위에/사이에 놓을 때
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(draggedElement, ev.target);
        } else {
            // 빈 공간에 놓을 때
            ev.target.appendChild(draggedElement);
        }
    }
}

/* ==========================================
   추가 기능: 이미지 저장 & 확대 모달
   ========================================== */
function saveTierList() {
    const captureArea = document.querySelector(".tier-section"); // 캡처 대상을 티어 영역만으로 한정
    
    html2canvas(captureArea, {
        backgroundColor: "#222",
        scrollX: 0,
        scrollY: 0,
        width: captureArea.scrollWidth, // 가로 스크롤 된 전체 영역 캡처
        windowWidth: document.documentElement.offsetWidth
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = 'obsidian-tier-list.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function openModal(src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    const modal = document.getElementById("image-modal");
    modal.style.display = "none";
}