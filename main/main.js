var searchBox = document.getElementById("searchBox");
var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("searchInput");
var listBox = document.getElementById("listBox");

const KEY_ENTER = 13;

searchBtn.addEventListener("click", search);
searchInput.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "Enter") {
    search();
  }
});

function search() {
  searchBox.classList.add("searched");
  RequestAPI();
}

function makelist(responseText) {
  for (var i = 0; i <= 9; i++) {
    var ul = document.createElement("ul");

    /* 썸네일 */
    var li = document.createElement("li");
    var img = document.createElement("img");
    img.setAttribute("src", responseText["documents"][i]["thumbnail"]);
    li.appendChild(img);
    ul.appendChild(li);

    /* 저자 | 출판사 */
    var li = document.createElement("li");
    var text = document.createTextNode(
      responseText["documents"][i]["authors"] +
        " | " +
        responseText["documents"][i]["publisher"]
    );

    li.appendChild(text);
    ul.appendChild(li);

    /* 출판일 (년 월) */
    var li = document.createElement("li");
    var datetimeArray = responseText["documents"][i]["datetime"]
      .substr(0, 7)
      .split("-");
    var text = document.createTextNode(
      datetimeArray[0] + "년 " + datetimeArray[1] + "월"
    );

    li.appendChild(text);
    ul.appendChild(li);

    /* 책 가격 */
    var li = document.createElement("li");
    if (responseText["documents"][i]["sale_price"] !== -1) {
      var text = document.createTextNode(
        responseText["documents"][i]["sale_price"] + " 원"
      );
    } else {
      var text = document.createTextNode(
        responseText["documents"][i]["price"] + " 원"
      );
    }

    li.appendChild(text);
    ul.appendChild(li);

    /* 책 제목 */
    var li = document.createElement("li");
    var text = document.createTextNode(responseText["documents"][i]["title"]);

    li.appendChild(text);
    ul.appendChild(li);

    /* 컨텐츠들 최종적으로 추가 */
    listBox.appendChild(ul);
  }

  /* Fade in */
  listBox.classList.add("show");
}

function RequestAPI() {
  var xhr = new XMLHttpRequest();
  var url = "https://dapi.kakao.com/v3/search/book?target=title";
  var apikey = "KakaoAK 357576fc652c16fd2a1a766b9e5ac3f1";
  var searchInput = document.getElementById("searchInput").value;

  xhr.open("GET", url + "&query=" + searchInput);
  xhr.setRequestHeader("Authorization", apikey);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      if (listBox.hasChildNodes()) {
        while (listBox.firstChild) {
          listBox.removeChild(listBox.firstChild);
        }
      }
      setTimeout(makelist(JSON.parse(xhr.responseText)), 2000);
    }
  };
  xhr.send();
}
