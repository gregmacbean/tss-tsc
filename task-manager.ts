/**
 * Creates a task manager with methods for managing different types of tasks
 * @returns {Object} Task manager functions
 */
function createTaskManager() {
    const tasks = [];
    let nextId = 1;

    /**
     * Create a regular task
     * @param {string} title - Task title
     * @param {string} [description] - Task description
     * @param {string} [dueDate] - Task due date string
     * @returns {number} - The ID of the created task
     */
    function createRegularTask(title, description, dueDate) {
        const task = {
            id: nextId++,
            title: title,
            description: description || "",
            completed: false,
            type: "regular",
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: new Date()
        };
        tasks.push(task);
        return task.id;
    }

    /**
     * Calculate the next occurrence date based on frequency
     * @param {string} frequency - "daily", "weekly", or "monthly"
     * @returns {Date} - The next occurrence date
     */
    function calculateNextDate(frequency) {
        const nextDate = new Date();

        // Simple mapping of frequency to days
        const daysToAdd = {
            "daily": 1,
            "weekly": 7,
            "monthly": 30 // Simplified to roughly a month
        };

        nextDate.setDate(nextDate.getDate() + (daysToAdd[frequency] || 0));
        return nextDate;
    }

    /**
     * Create a recurring task
     * @param {string} title - Task title
     * @param {string} description - Task description
     * @param {string} frequency - "daily", "weekly", or "monthly"
     * @returns {number} - The ID of the created task
     */
    function createRecurringTask(title, description, frequency) {
        const task = {
            id: nextId++,
            title: title,
            description: description || "",
            completed: false,
            type: "recurring",
            frequency: frequency,
            nextOccurrence: calculateNextDate(frequency),
            createdAt: new Date()
        };
        tasks.push(task);
        return task.id;
    }

    /**
     * Check if a task is a recurring task
     * @param {Object} task - The task to check
     * @returns {boolean} - True if the task is a recurring task
     */
    function isRecurringTask(task) {
        return task.type === "recurring";
    }

    /**
     * Find a task by ID
     * @param {number} id - The task ID to find
     * @returns {Object|undefined} - The found task or undefined
     */
    function getTaskById(id) {
        return tasks.find(task => task.id === id);
    }

    /**
     * Mark a task as complete
     * @param {number} id - The task ID to complete
     * @returns {Object} - Result with success flag and message
     */
    function completeTask(id) {
        const task = getTaskById(id);
        if (!task) {
            return { success: false, message: "Task not found" };
        }

        task.completed = true;

        // Simplified logic for recurring tasks
        if (isRecurringTask(task)) {
            task.nextOccurrence = calculateNextDate(task.frequency);
            return {
                success: true,
                message: `Task marked complete. Next occurrence: ${task.nextOccurrence.toDateString()}`
            };
        }

        return { success: true, message: "Task marked as complete" };
    }

    /**
     * Get tasks by type
     * @param {Function} predicate - Function to test each task
     * @returns {Array} - Filtered tasks
     */
    function getTasksByType(predicate) {
        return tasks.filter(predicate);
    }

    /**
     * Get all tasks
     * @returns {Array} - All tasks
     */
    function getAllTasks() {
        return tasks;
    }

    // Return the public API
    return {
        createRegularTask,
        createRecurringTask,
        getTaskById,
        completeTask,
        getTasksByType,
        getAllTasks
    };
}

export { createTaskManager };