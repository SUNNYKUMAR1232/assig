const applications = [
  { name: "सुनीता देवी", village: "मनेर", ref: "RTPS-INC-2026-00128", date: "25 अक्टूबर 2026", status: "समीक्षा लंबित", priority: "तात्कालिक", tone: "pink-a" },
  { name: "रवि कुमार", village: "दानापुर", ref: "RTPS-INC-2026-00127", date: "25 अक्टूबर 2026", status: "समीक्षा लंबित", priority: "सामान्य", tone: "blue-a" },
  { name: "मोहन प्रसाद", village: "फुलवारी", ref: "RTPS-INC-2026-00126", date: "24 अक्टूबर 2026", status: "समीक्षा लंबित", priority: "सामान्य", tone: "green-a" },
  { name: "रीना कुमारी", village: "दानापुर", ref: "RTPS-INC-2026-00125", date: "24 अक्टूबर 2026", status: "जांच पूरी", priority: "सामान्य", tone: "yellow-a" },
  { name: "अरुण यादव", village: "मनेर", ref: "RTPS-INC-2026-00124", date: "23 अक्टूबर 2026", status: "समीक्षा लंबित", priority: "सामान्य", tone: "" }
];

const rows = document.querySelector("#applicationRows");
const modal = document.querySelector("#reviewModal");
const toast = document.querySelector("#toast");
let toastTimer;

function initials(name) {
  return name.slice(0, 1);
}

function renderRows() {
  rows.innerHTML = applications.map((application, index) => `
    <tr>
      <td><div class="applicant"><span class="small-avatar ${application.tone}">${initials(application.name)}</span><div>${application.name}<span class="subtext">${application.village}</span></div></div></td>
      <td>${application.ref}</td>
      <td>${application.date}</td>
      <td><span class="status-pill ${application.status === "जांच पूरी" ? "reviewed" : "pending"}">${application.status}</span></td>
      <td class="${application.priority === "तात्कालिक" ? "urgent" : "normal"}">${application.priority === "तात्कालिक" ? "● " : ""}${application.priority}</td>
      <td><button class="row-action" data-index="${index}" aria-label="आवेदन खोलें">›</button></td>
    </tr>`).join("");
}

function openReview(index = 0) {
  const application = applications[index];
  document.querySelector("#detailName").textContent = application.name;
  document.querySelector("#detailInitial").textContent = initials(application.name);
  document.querySelector("#detailRef").textContent = `आवेदन संख्या: ${application.ref}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeReview() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

rows.addEventListener("click", (event) => {
  const button = event.target.closest("[data-index]");
  if (button) openReview(Number(button.dataset.index));
});
document.querySelector("#closeModal").addEventListener("click", closeReview);
modal.addEventListener("click", (event) => { if (event.target === modal) closeReview(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && modal.classList.contains("open")) closeReview(); });
document.querySelector("#newApplication").addEventListener("click", () => showToast("नया आवेदन पंजीकरण मॉड्यूल जल्द उपलब्ध होगा।"));
document.querySelector("#returnButton").addEventListener("click", () => {
  showToast("आवेदन सुधार के लिए वापस करने हेतु कारण दर्ज करना आवश्यक है।");
});
document.querySelector("#rejectButton").addEventListener("click", () => showToast("अस्वीकृति के लिए प्रक्रिया-आधारित कारण आवश्यक है।"));
document.querySelector("#approveButton").addEventListener("click", () => showToast("स्वीकृति से पहले सभी आवश्यक जांच पूरी करें।"));
renderRows();
