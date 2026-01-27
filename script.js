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

        // ★ 스타일 설정 (찌그러짐 방지 포함)
        img.style.width = "100px";      // 오른쪽 목록에 맞게 크기 약간 조절
        img.style.height = "auto";
        img.style.cursor = "pointer";
        img.style.border = "2px solid transparent";
        
        // ★ [핵심] 가로 스크롤에서 이미지가 종잇장처럼 구겨지지 않게 방지
        img.style.flexShrink = "0"; 

        img.onmouseover = function() { this.style.border = "2px solid white"; };
        img.onmouseout = function() { this.style.border = "2px solid transparent"; };
        img.onclick = function() { openModal(this.src); };
        img.ondragstart = drag;
        img.onerror = function() { this.style.display = "none"; };

        bankContent.appendChild(img);
    }
};

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
   기능: 저장 & 모달
   ========================================== */
function saveTierList() {
    // 캡처할 때 왼쪽 패널만 캡처 (가로 스크롤 된 전체 내용을 포함하려 노력)
    const captureArea = document.querySelector(".left-panel");
    
    html2canvas(captureArea, {
        backgroundColor: "#222",
        scale: 2 // 고화질 저장
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = 'obsidian-tier-list.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function openModal(src) {
    document.getElementById("image-modal").style.display = "flex";
    document.getElementById("modal-img").src = src;
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";
}