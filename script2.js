document.addEventListener("DOMContentLoaded", () => {
    const studySessions = [];

    const studyForm = document.getElementById("studyForm");
    const sessionList = document.getElementById("sessionList");
    const fetchMaterialsButton = document.getElementById("fetchMaterials");
    const studyMaterialsDiv = document.getElementById("studyMaterials");

    studyForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const topic = document.getElementById("topic").value.trim();
        const sessionTime = new Date(document.getElementById("sessionTime").value);
        const duration = parseInt(document.getElementById("duration").value, 10);

        try {
            if (!topic || isNaN(sessionTime.getTime()) || isNaN(duration) || duration <= 0) {
                throw new Error("Please enter valid session details.");
            }

            const session = { topic, sessionTime, duration };
            studySessions.push(session);
            displaySessions();
            scheduleSessionAlert(session);
            studyForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });

    function displaySessions() {
        sessionList.innerHTML = "";
        const today = new Date().toDateString();

        const todaySessions = studySessions.filter(session => 
            new Date(session.sessionTime).toDateString() === today
        );

        if (todaySessions.length === 0) {
            sessionList.innerHTML = "<li>No sessions scheduled for today.</li>";
            return;
        }

        todaySessions.forEach(session => {
            const li = document.createElement("li");
            li.textContent = `${session.topic} at ${session.sessionTime.toLocaleTimeString()} for ${session.duration} mins`;
            sessionList.appendChild(li);
        });
    }

    function scheduleSessionAlert(session) {
        const now = new Date();
        const timeUntilSession = session.sessionTime - now;

        if (timeUntilSession > 0) {
            setTimeout(() => {
                alert(`Session on "${session.topic}" starts now!`);
            }, timeUntilSession);
        }
    }

    async function fetchStudyMaterials(topic) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (topic) {
                    resolve(`Study materials for "${topic}": Notes, Videos, and Practice Tests.`);
                } else {
                    reject("No topic selected.");
                }
            }, 2000);
        });
    }

    fetchMaterialsButton.addEventListener("click", async () => {
        if (studySessions.length === 0) {
            alert("No study sessions available.");
            return;
        }

        const latestSession = studySessions[studySessions.length - 1];

        try {
            const materials = await fetchStudyMaterials(latestSession.topic);
            studyMaterialsDiv.textContent = materials;
        } catch (error) {
            alert(error);
        }
    });
});
