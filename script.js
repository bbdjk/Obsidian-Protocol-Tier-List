/* ==========================================
   설정 구역
   ========================================== */
const imageFolder = "./images/";
const fileExtension = ".png"; 
const totalImages = 500;  // 넉넉하게 잡음

/* ==========================================
   이미지 자동 생성 로직
   ========================================== */
window.onload = function() {
    const bankContent = document.getElementById("bank-content");

    // ★ 유저 이미지 파일이 081번부터 시작하므로 81로 설정
    for (let i = 0; i < totalImages; i++) { 
       
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        
        let img = document.createElement("img");
        img.src = imageFolder + fileName;
        img.id = "img_" + formattedNumber; 
        img.draggable = true;
        img.alt = fileName;

        img.ondragstart = drag;

        // 이미지가 없으면 숨김
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