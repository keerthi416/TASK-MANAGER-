// =====================================================
// SMART TASK MANAGER
// MULTI-USER LOCAL STORAGE VERSION
// =====================================================


// =====================================================
// GET ELEMENTS
// =====================================================

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");

const registerMessage =
    document.getElementById("registerMessage");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");


// =====================================================
// CURRENT USER
// =====================================================

let currentUser = null;


// =====================================================
// INITIAL PAGE
// =====================================================

loginPage.style.display = "flex";
registerPage.style.display = "none";
dashboard.style.display = "none";


// =====================================================
// OPEN REGISTER
// =====================================================

showRegister.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        loginPage.style.display = "none";
        registerPage.style.display = "flex";

        message.textContent = "";
        registerMessage.textContent = "";

    }
);


// =====================================================
// BACK TO LOGIN
// =====================================================

showLogin.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        registerPage.style.display = "none";
        loginPage.style.display = "flex";

        registerMessage.textContent = "";

    }
);


// =====================================================
// GET ALL USERS
// =====================================================

function getUsers() {

    const users =
        localStorage.getItem("smartTaskUsers");

    if (!users) {
        return {};
    }

    try {
        return JSON.parse(users);
    } catch (error) {
        return {};
    }
}


// =====================================================
// SAVE ALL USERS
// =====================================================

function saveUsers(users) {

    localStorage.setItem(
        "smartTaskUsers",
        JSON.stringify(users)
    );

}


// =====================================================
// CREATE ACCOUNT
// =====================================================

registerForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            document
                .getElementById("registerName")
                .value
                .trim();

        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("registerPassword")
                .value;

        if (
            name === "" ||
            email === "" ||
            password === ""
        ) {

            registerMessage.textContent =
                "Please fill in all fields.";

            registerMessage.style.color = "red";

            return;
        }

        const users = getUsers();

        if (users[email]) {

            registerMessage.textContent =
                "This email is already registered.";

            registerMessage.style.color = "red";

            return;
        }

        users[email] = {

            name: name,
            email: email,
            password: password

        };

        saveUsers(users);

        localStorage.setItem(
            getTaskKey(email),
            JSON.stringify([])
        );

        registerMessage.textContent =
            "Account created successfully!";

        registerMessage.style.color = "green";

        registerForm.reset();

    }
);


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("password")
                .value;

        const users = getUsers();

        if (!users[email]) {

            message.textContent =
                "Email is not registered.";

            message.style.color = "red";

            return;
        }

        const user = users[email];

        if (password !== user.password) {

            message.textContent =
                "Incorrect email or password.";

            message.style.color = "red";

            return;
        }

        currentUser = user;

        message.textContent =
            "Login successful!";

        message.style.color = "green";

        loginPage.style.display = "none";
        registerPage.style.display = "none";
        dashboard.style.display = "block";

        const welcomeTitle =
            document.getElementById("welcomeTitle");

        welcomeTitle.textContent =
            "Welcome, " + user.name + "!";

        loadTasks();

    }
);


// =====================================================
// USER TASK STORAGE KEY
// =====================================================

function getTaskKey(email) {

    return "smartTasks_" +
        email
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_");

}


// =====================================================
// ADD TASK
// =====================================================

function addTask() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }

    const taskInput =
        document.getElementById("taskInput");

    const priority =
        document.getElementById("priority");

    const dueDate =
        document.getElementById("dueDate");

    const taskList =
        document.getElementById("taskList");

    const taskText =
        taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }

    if (dueDate.value === "") {

        alert("Please select a due date.");

        return;
    }

    const listItem =
        document.createElement("li");

    const taskInfo =
        document.createElement("div");

    const taskName =
        document.createElement("strong");

    taskName.textContent =
        taskText;

    const taskDetails =
        document.createElement("small");

    taskDetails.textContent =
        "Priority: " +
        priority.value +
        " | Due: " +
        dueDate.value;

    taskDetails.classList.add(
        priority.value.toLowerCase() +
        "-priority"
    );

    taskInfo.appendChild(taskName);

    taskInfo.appendChild(
        document.createElement("br")
    );

    taskInfo.appendChild(taskDetails);


    // =================================================
    // COMPLETE
    // =================================================

    const completeButton =
        document.createElement("button");

    completeButton.textContent =
        "Complete";

    completeButton.addEventListener(
        "click",
        function () {

            taskName.classList.toggle("completed");

            if (
                taskName.classList.contains("completed")
            ) {

                completeButton.textContent =
                    "Completed";

                removeOverdueText(taskDetails);

            } else {

                completeButton.textContent =
                    "Complete";

                checkSingleTaskOverdue(
                    taskDetails,
                    taskName
                );

            }

            updateTaskStats();
            saveTasks();

        }
    );


    // =================================================
    // EDIT
    // =================================================

    const editButton =
        document.createElement("button");

    editButton.textContent =
        "Edit";

    editButton.addEventListener(
        "click",
        function () {

            const newTask =
                prompt(
                    "Edit your task:",
                    taskName.textContent
                );

            if (
                newTask !== null &&
                newTask.trim() !== ""
            ) {

                taskName.textContent =
                    newTask.trim();

                saveTasks();

            }

        }
    );


    // =================================================
    // DELETE
    // =================================================

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.addEventListener(
        "click",
        function () {

            listItem.remove();

            updateTaskStats();
            saveTasks();

        }
    );


    // =================================================
    // ADD TO LIST
    // =================================================

    listItem.appendChild(taskInfo);

    listItem.appendChild(completeButton);

    listItem.appendChild(editButton);

    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);


    // Clear inputs

    taskInput.value = "";

    priority.value = "Medium";

    dueDate.value = "";


    checkSingleTaskOverdue(
        taskDetails,
        taskName
    );

    updateTaskStats();

    saveTasks();

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateTaskStats() {

    const tasks =
        document.querySelectorAll("#taskList li");

    let completed = 0;

    tasks.forEach(
        function (task) {

            const taskName =
                task.querySelector("strong");

            if (
                taskName &&
                taskName.classList.contains("completed")
            ) {

                completed++;

            }

        }
    );

    const total = tasks.length;

    const pending =
        total - completed;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

}


// =====================================================
// SAVE CURRENT USER'S TASKS
// =====================================================

function saveTasks() {

    if (!currentUser) {
        return;
    }

    const tasks = [];

    document
        .querySelectorAll("#taskList li")
        .forEach(
            function (task) {

                const taskName =
                    task.querySelector("strong");

                const taskDetails =
                    task.querySelector("small");

                if (
                    !taskName ||
                    !taskDetails
                ) {
                    return;
                }

                tasks.push({

                    name:
                        taskName.textContent,

                    details:
                        removeOverdueText(
                            taskDetails.textContent
                        ),

                    completed:
                        taskName.classList.contains(
                            "completed"
                        )

                });

            }
        );

    localStorage.setItem(
        getTaskKey(currentUser.email),
        JSON.stringify(tasks)
    );

}


// =====================================================
// LOAD CURRENT USER'S TASKS
// =====================================================

function loadTasks() {

    if (!currentUser) {
        return;
    }

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    const savedTasks =
        localStorage.getItem(
            getTaskKey(currentUser.email)
        );

    if (!savedTasks) {

        updateTaskStats();

        return;
    }

    let tasks;

    try {

        tasks =
            JSON.parse(savedTasks);

    } catch (error) {

        tasks = [];

    }

    tasks.forEach(
        function (task) {

            createLoadedTask(task);

        }
    );

    updateTaskStats();

}


// =====================================================
// CREATE LOADED TASK
// =====================================================

function createLoadedTask(task) {

    const taskList =
        document.getElementById("taskList");

    const listItem =
        document.createElement("li");

    const taskInfo =
        document.createElement("div");

    const taskName =
        document.createElement("strong");

    taskName.textContent =
        task.name;

    if (task.completed) {

        taskName.classList.add("completed");

    }

    const taskDetails =
        document.createElement("small");

    taskDetails.textContent =
        removeOverdueText(task.details);

    const priorityMatch =
        task.details.match(
            /Priority:\s*(High|Medium|Low)/i
        );

    if (priorityMatch) {

        taskDetails.classList.add(
            priorityMatch[1].toLowerCase() +
            "-priority"
        );

    }

    taskInfo.appendChild(taskName);

    taskInfo.appendChild(
        document.createElement("br")
    );

    taskInfo.appendChild(taskDetails);


    // =================================================
    // COMPLETE BUTTON
    // =================================================

    const completeButton =
        document.createElement("button");

    completeButton.textContent =
        task.completed
            ? "Completed"
            : "Complete";

    completeButton.addEventListener(
        "click",
        function () {

            taskName.classList.toggle("completed");

            if (
                taskName.classList.contains("completed")
            ) {

                completeButton.textContent =
                    "Completed";

                removeOverdueText(taskDetails);

            } else {

                completeButton.textContent =
                    "Complete";

                checkSingleTaskOverdue(
                    taskDetails,
                    taskName
                );

            }

            updateTaskStats();
            saveTasks();

        }
    );


    // =================================================
    // EDIT BUTTON
    // =================================================

    const editButton =
        document.createElement("button");

    editButton.textContent =
        "Edit";

    editButton.addEventListener(
        "click",
        function () {

            const newTask =
                prompt(
                    "Edit your task:",
                    taskName.textContent
                );

            if (
                newTask !== null &&
                newTask.trim() !== ""
            ) {

                taskName.textContent =
                    newTask.trim();

                saveTasks();

            }

        }
    );


    // =================================================
    // DELETE BUTTON
    // =================================================

    const deleteButton =
        document.createElement("button");

    deleteButton.textContent =
        "Delete";

    deleteButton.addEventListener(
        "click",
        function () {

            listItem.remove();

            updateTaskStats();
            saveTasks();

        }
    );


    // =================================================
    // ADD TO LIST
    // =================================================

    listItem.appendChild(taskInfo);

    listItem.appendChild(completeButton);

    listItem.appendChild(editButton);

    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);


    if (!task.completed) {

        checkSingleTaskOverdue(
            taskDetails,
            taskName
        );

    }

}


// =====================================================
// SEARCH AND FILTER
// =====================================================

function filterTasks() {

    const searchBox =
        document.getElementById("searchTask");

    const filterBox =
        document.getElementById("filterStatus");

    const taskList =
        document.getElementById("taskList");

    if (
        !searchBox ||
        !filterBox ||
        !taskList
    ) {
        return;
    }

    const searchText =
        searchBox.value
            .toLowerCase()
            .trim();

    const selectedFilter =
        filterBox.value;

    const tasks =
        taskList.getElementsByTagName("li");

    for (
        let i = 0;
        i < tasks.length;
        i++
    ) {

        const task =
            tasks[i];

        const taskName =
            task.querySelector("strong");

        if (!taskName) {
            continue;
        }

        const taskText =
            taskName.textContent
                .toLowerCase();

        const isCompleted =
            taskName.classList.contains(
                "completed"
            );

        const matchesSearch =
            taskText.includes(searchText);

        let matchesFilter = true;

        if (
            selectedFilter === "completed"
        ) {

            matchesFilter =
                isCompleted;

        }

        if (
            selectedFilter === "pending"
        ) {

            matchesFilter =
                !isCompleted;

        }

        if (
            matchesSearch &&
            matchesFilter
        ) {

            task.style.display = "flex";

        } else {

            task.style.display = "none";

        }

    }

}


// =====================================================
// OVERDUE CHECK
// =====================================================

function checkSingleTaskOverdue(
    taskDetails,
    taskName
) {

    if (
        !taskDetails ||
        !taskName
    ) {
        return;
    }

    removeOverdueText(taskDetails);

    if (
        taskName.classList.contains("completed")
    ) {
        return;
    }

    const match =
        taskDetails.textContent.match(
            /Due:\s*(\d{4}-\d{2}-\d{2})/
        );

    if (!match) {
        return;
    }

    const dueDate =
        new Date(
            match[1] + "T00:00:00"
        );

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    if (dueDate < today) {

        taskDetails.textContent =
            taskDetails.textContent +
            " | OVERDUE";

        taskDetails.classList.add("overdue");

    }

}


// =====================================================
// REMOVE OVERDUE TEXT
// =====================================================

function removeOverdueText(value) {

    if (
        typeof value === "string"
    ) {

        return value
            .replace(
                /\s*\|\s*OVERDUE/g,
                ""
            )
            .trim();

    }

    if (
        value &&
        value.textContent !== undefined
    ) {

        value.textContent =
            value.textContent
                .replace(
                    /\s*\|\s*OVERDUE/g,
                    ""
                )
                .trim();

        value.classList.remove("overdue");

        return value.textContent;

    }

    return "";

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    currentUser = null;

    dashboard.style.display = "none";

    registerPage.style.display = "none";

    loginPage.style.display = "flex";

    document.getElementById("email").value = "";

    document.getElementById("password").value = "";

    message.textContent = "";

    document.getElementById(
        "taskList"
    ).innerHTML = "";

    updateTaskStats();

}


// =====================================================
// SEARCH EVENTS
// =====================================================

const searchTask =
    document.getElementById("searchTask");

const filterStatus =
    document.getElementById("filterStatus");

if (searchTask) {

    searchTask.addEventListener(
        "input",
        filterTasks
    );

}

if (filterStatus) {

    filterStatus.addEventListener(
        "change",
        filterTasks
    );

}


// =====================================================
// BROWSER NOTIFICATIONS
// =====================================================

function requestNotificationPermission() {

    if (!("Notification" in window)) {

        alert(
            "This browser does not support notifications."
        );

        return;
    }

    if (Notification.permission === "granted") {

        alert(
            "✅ Notifications are already enabled!"
        );

        return;
    }

    if (Notification.permission === "denied") {

        alert(
            "Notifications are blocked in your browser settings."
        );

        return;
    }

    Notification.requestPermission()
        .then(
            function (permission) {

                if (permission === "granted") {

                    alert(
                        "✅ Notifications enabled successfully!"
                    );

                } else {

                    alert(
                        "Notifications were not allowed."
                    );

                }

            }
        );

}


// =====================================================
// CHECK FOR DUE TASKS
// =====================================================

function checkTaskReminders() {

    if (!currentUser) {
        return;
    }

    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }

    const tasks =
        document.querySelectorAll(
            "#taskList li"
        );

    tasks.forEach(
        function (task) {

            const taskName =
                task.querySelector("strong");

            const taskDetails =
                task.querySelector("small");

            if (
                !taskName ||
                !taskDetails
            ) {
                return;
            }

            if (
                taskName.classList.contains(
                    "completed"
                )
            ) {
                return;
            }

            const match =
                taskDetails.textContent.match(
                    /Due:\s*(\d{4}-\d{2}-\d{2})/
                );

            if (!match) {
                return;
            }

            const dueDate =
                match[1];

            // Get today's date in local time

            const now = new Date();

            const year =
                now.getFullYear();

            const month =
                String(
                    now.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    now.getDate()
                ).padStart(2, "0");

            const today =
                year + "-" + month + "-" + day;

            if (dueDate === today) {

                const notificationKey =
                    "notified_" +
                    currentUser.email +
                    "_" +
                    taskName.textContent +
                    "_" +
                    dueDate;

                if (
                    localStorage.getItem(
                        notificationKey
                    )
                ) {
                    return;
                }

                new Notification(
                    "🔔 Task Reminder",
                    {
                        body:
                            taskName.textContent +
                            " is due today!"
                    }
                );

                localStorage.setItem(
                    notificationKey,
                    "true"
                );

            }

        }
    );

}


// =====================================================
// START NOTIFICATION SYSTEM
// =====================================================

// We do NOT request permission automatically.
// The user can press the button manually.


// =====================================================
// CHECK EVERY MINUTE
// =====================================================

setInterval(
    checkTaskReminders,
    60000
);
setTimeout(function () {
    if (Notification.permission === "granted") {
        new Notification("🔔 Test Notification", {
            body: "Your Smart Task Manager notifications are working!"
        });
    }
}, 5000);