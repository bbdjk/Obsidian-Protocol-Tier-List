/* ==========================================
   설정 구역
   ========================================== */
const imageBaseFolder = "./images/"; 
const fileExtension = ".png"; 
const totalImages = 200; 

let currentCategory = 'UN'; 

/* ==========================================
   초기 실행
   ========================================== */
window.onload = function() {
    changeCategory('UN');
};

/* ==========================================
   카테고리 변경 (무한 복제 및 중복 해결)
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
        
        let bankId = `bank_${category}_${formattedNumber}`;

        let img = createImgElement(fullPath, bankId);
        
        img.onerror = function() { this.style.display = "none"; };

        bankContent.appendChild(img);
    }
}

function createImgElement(src, id) {
    let img = document.createElement("img");
    img.src = src;
    img.id = id; 
    img.draggable = true;
    
    img.style.width = "100px";
    img.style.height = "auto";
    img.style.cursor = "pointer";
    img.style.border = "2px solid transparent";
    img.style.flexShrink = "0"; 

    img.onmouseover = function() { this.style.border = "2px solid white"; };
    img.onmouseout = function() { this.style.border = "2px solid transparent"; };
    img.onclick = function() { openModal(this.src); };
    img.ondragstart = drag;

    return img;
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
    
    if (!draggedElement) return;

    // 창고(bank_)에서 온 경우 -> 복제본 생성
    if (draggedElement.id.startsWith("bank_")) {
        var clone = createImgElement(draggedElement.src, "placed_" + new Date().getTime() + Math.random());
        
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(clone, ev.target);
        } else {
            ev.target.appendChild(clone);
        }
    } 
    // 이미 배치된 경우 -> 이동
    else {
        if (ev.target.tagName === "IMG") {
            ev.target.parentNode.insertBefore(draggedElement, ev.target);
        } else {
            ev.target.appendChild(draggedElement);
        }
    }
}

/* ==========================================
   기능: 저장 (촬영용 세트장)
   ========================================== */
function saveTierList() {
    const originalPanel = document.querySelector(".left-panel");
    const btn = document.querySelector(".save-btn");
    const originalText = btn.innerText;

    btn.innerText = "이미지 생성 중...";
    btn.disabled = true;

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

function openModal(src) {
    document.getElementById("image-modal").style.display = "flex";
    document.getElementById("modal-img").src = src;
}

function closeModal() {
    document.getElementById("image-modal").style.display = "none";

}
