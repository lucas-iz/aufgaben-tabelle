const now = Date.now();

function isPlashed() {
  let html = document.querySelector("html");
  var classList = html.classList;
  let isPlashed = classList.contains("is-plash-app");
  return isPlashed;
}

if (isPlashed) {
  document.getElementById("list").style.backgroundColor = "rgba(0,0,0,0.5)";
  document.getElementById("list").style.borderRadius = "10px";
}

function setDarkmodeIfDark() {
  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (!isPlashed() && dark) {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
  }
}

setDarkmodeIfDark();

fetch("readDB.php")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let sortierteAufgaben = data.sort((p1, p2) =>
      p1.time > p2.time ? 1 : p1.time < p2.time ? -1 : 0
    );
    appendData(sortierteAufgaben);
    formatTable();
  })
  .catch(function (error) {
    console.log("error: " + error);
  });

function appendData(data) {
  const list = document.getElementById("list");
  for (let i = 0; i < data.length; i++) {
    const timeParsed = new Date(Date.parse(data[i].time));
    const dueTime = getPrintDateTime(timeParsed);
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = dueTime;
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerHTML = data[i].modul;
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerHTML = data[i].aufgabe;
    tr.appendChild(td3);

    const td4 = document.createElement("td");
    td4.class = "checkbox";
    td4.onclick = function () {
      updateCheckbox(data[i].id, 1);
    };
    td4.innerHTML = formatCheckmark(data[i].todo);
    tr.appendChild(td4);

    const td5 = document.createElement("td");
    td5.class = "checkbox";
    td5.onclick = function () {
      updateCheckbox(data[i].id, 2);
    };
    td5.innerHTML = formatCheckmark(data[i].doing);
    tr.appendChild(td5);

    const td6 = document.createElement("td");
    td6.class = "checkbox";
    td6.onclick = function () {
      updateCheckbox(data[i].id, 3);
    };
    td6.innerHTML = formatCheckmark(data[i].done);
    tr.appendChild(td6);

    list.appendChild(tr);
  }
  // sortTable();
}

function showInput() {
  const inputField = document.querySelector("#newInput");
  if (inputField.style.display == "" || inputField.style.display == "none") {
    // When the 'Add'-button is pressed.
    inputField.style.display = "table-row";
    document.querySelector("#in-button").value = "Hide Inputs";
    document.querySelector("#in-send").style.display = "inline";
    document.querySelector("#in-time").value = "2021-03-30T12:00";
  } else {
    inputField.style.display = "none";
    document.querySelector("#in-button").value = "Add";
    document.querySelector("#in-send").style.display = "none";
  }
}

function sendInput() {
  const date = document.getElementById("in-time").value;
  const modul = document.getElementById("in-modul").value;
  const aufgabe = document.getElementById("in-aufgabe").value;
  const state = document.querySelector('input[name="in-state"]:checked').value;

  const formattedDate = formatDateTime(date);

  const url =
    "addDB.php?date=" +
    formattedDate +
    "&modul=" +
    modul +
    "&aufgabe=" +
    aufgabe +
    "&state=" +
    state;
  console.log(url);

  fetch(url)
    .then(function (response) {
      return response.json;
    })
    .then(function (data) {
      location.reload();
    })
    .catch(function (error) {
      console.log("error: " + error);
    });
}

function showButtons() {
  document.getElementById("in-button").style.display = "inline";
  document.getElementById("in-send").style.display = "inline";
}

// 2023-03-30T12:00 -> 2023-03-30 12:00:00
function formatDateTime(datetime) {
  const out = datetime.replace("T", " ");

  return out + ":00";
}

function updateCheckbox(id, box) {
  let endpoint;
  if (box == 1) endpoint = "doing=1";
  else if (box == 2) endpoint = "done=1";
  else endpoint = "todo=1";

  const url = "editDB.php?id=" + id + "&" + endpoint;
  console.log(url);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      location.reload();
    })
    .catch(function (error) {
      console.log("error: " + error);
    });
}

function formatCheckmark(checkmark) {
  if (checkmark == 1) return "X";
  else return " ";
}

function getPrintDateTime(timestamp) {
  const day = addZeroIfNeeded(timestamp.getDate());
  const month = addZeroIfNeeded(timestamp.getMonth() + 1);
  const year = convertYearToTwoDigits(timestamp.getFullYear());
  const hour = addZeroIfNeeded(timestamp.getHours());
  const minute = addZeroIfNeeded(timestamp.getMinutes());

  return day + "." + month + "." + year + " " + hour + ":" + minute;
}

function addZeroIfNeeded(number) {
  if (number < 10) return "0" + number;
  else return number;
}

function convertYearToTwoDigits(year) {
  const yearAsString = year.toString();
  return yearAsString.substring(2);
}

function sortTable() {
  console.log("Sorting...");

  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("list");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].firstElementChild;
      y = rows[i + 1].firstElementChild;

      console.log(x.innerHTML);
      console.log(y.innerHTML);

      if (x.innerHTML > y.innerHTML) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      console.log("Switched");
    }
    console.log(" ");
  }

  console.log("Sorted.");
}

function formatTable() {
  const list = document.getElementById("list").children;

  for (let item of list) {
    if (item.tagName == "TR") {
      const text = item.firstChild.innerHTML;
      const datetime = text.split(" ");
      const date = datetime[0];
      const time = datetime[1];
      const dateElements = date.split(".");
      const day = Number(dateElements[0]);
      const month = Number(dateElements[1]) - 1;
      const year = Number("20" + dateElements[2]);
      const timeElements = time.split(":");
      const hour = Number(timeElements[0]);
      const minute = Number(timeElements[1]);

      let myDate = new Date();
      myDate.setFullYear(year, month, day);
      myDate.setHours(hour, minute);

      const isDone = item.lastChild.innerHTML == "X";

      if (myDate < now && isDone) {
        item.style.color = "red";
        item.style.display = "none";
      } else if (myDate - 604800000 <= now) {
        // minus 7 days
        if (isDone) {
          item.style.color = "green";
          if (isPlashed()) item.style.color = "lightgreen";
        } else item.style.color = "orange";
      }
    }
  }
}
