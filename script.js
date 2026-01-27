/* ==========================================
   설정 구역 (여기만 수정하면 됩니다)
   ========================================== */
const imageFolder = "./images/";  // 이미지가 있는 폴더 경로
const fileExtension = ".png";     // 이미지 확장자 (.png, .jpg 등)
const totalImages = 1000;           // 현재 준비된 이미지 개수 (예: 50개면 000~049까지 불러옴)

/* ==========================================
   이미지 자동 생성 로직
   ========================================== */
window.onload = function() {
    const bankContent = document.getElementById("bank-content");

    for (let i = 0; i < totalImages; i++) {
        // 1. 숫자 포맷팅 (0 -> "000", 15 -> "015")
        let formattedNumber = i.toString().padStart(3, '0'); 
        let fileName = formattedNumber + fileExtension;
        
        // 2. 이미지 태그 생성
        let img = document.createElement("img");
        img.src = imageFolder + fileName;
        img.id = "img_" + formattedNumber; // ID도 고유하게 생성 (예: img_000)
        img.draggable = true;
        img.alt = fileName;

        // 3. 드래그 기능 연결
        img.ondragstart = drag;

        // 4. 이미지가 로딩 실패했을 때 (파일이 없을 경우) 숨김 처리
        img.onerror = function() {
            this.style.display = "none";
        };

        // 5. 화면에 추가
        bankContent.appendChild(img);
    }
};

/* ==========================================
   드래그 앤 드롭 기능 (기존과 동일)
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
        // 드롭한 위치가 이미지 위라면, 그 이미지의 부모(박스)에 넣게 함
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.appendChild(draggedElement);
        } else {
            ev.target.appendChild(draggedElement);
        }
    }
}