/* ==========================================
   설정 구역
   ========================================== */
const imageFolder = "./images/";
const fileExtension = ".png"; 
const totalImages = 500;  // 81번부터 나오게 하려면 넉넉하게 200

/* ==========================================
   이미지 자동 생성 로직
   ========================================== */
window.onload = function() {
    const bankContent = document.getElementById("bank-content");

    // 81번 파일부터 시작
    for (let i = 0; i < totalImages; i++) { 
        
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        
        let img = document.createElement("img");
        img.src = imageFolder + fileName;
        img.id = "img_" + formattedNumber; 
        img.draggable = true; // 드래그 허용
        img.alt = fileName;

        /* ★ CSS가 고장나도 작동하도록 강제로 스타일 주입 ★ */
        img.style.width = "120px";       // 가로 크기 고정
        img.style.height = "auto";       // 세로 비율 유지 (카드가 찌그러지지 않음)
        img.style.maxHeight = "180px";   // 너무 길어지지 않게 제한
        img.style.margin = "5px";
        img.style.cursor = "grab";
        img.style.border = "2px solid transparent";

        // 마우스 올렸을 때 테두리 효과
        img.onmouseover = function() { this.style.border = "2px solid white"; };
        img.onmouseout = function() { this.style.border = "2px solid transparent"; };

        // 드래그 기능 연결
        img.ondragstart = drag;

        // 이미지가 없으면 숨김 (엑박 방지)
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
        // 이미지를 다른 이미지 위에 놓았을 때 (순서 바꾸기/끼워넣기)
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.appendChild(draggedElement);
        } else {
            // 빈 공간에 놓았을 때
            ev.target.appendChild(draggedElement);
        }
    }
}