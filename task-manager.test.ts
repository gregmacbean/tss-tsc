import { describe, it, expect, beforeEach } from 'vitest';
import { createTaskManager } from './task-manager';

describe('TaskManager', () => {
    let taskManager;

    beforeEach(() => {
        taskManager = createTaskManager();
    });

    describe('Regular Tasks', () => {
        it('should create a regular task', () => {
            const id = taskManager.createRegularTask('Test Task', 'Test Description', '2025-04-01');

            const tasks = taskManager.getAllTasks();
            expect(tasks.length).toBe(1);
            expect(tasks[0].id).toBe(id);
            expect(tasks[0].title).toBe('Test Task');
            expect(tasks[0].description).toBe('Test Description');
            expect(tasks[0].type).toBe('regular');
            expect(tasks[0].completed).toBe(false);
            expect(tasks[0].dueDate).toBeInstanceOf(Date);
        });

        it('should create a regular task without optional parameters', () => {
            const id = taskManager.createRegularTask('Minimal Task');

            const task = taskManager.getTaskById(id);
            expect(task.title).toBe('Minimal Task');
            expect(task.description).toBe('');
            expect(task.dueDate).toBeNull();
        });

        it('should complete a regular task', () => {
            const id = taskManager.createRegularTask('Task to Complete');

            const result = taskManager.completeTask(id);
            const task = taskManager.getTaskById(id);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Task marked as complete');
            expect(task.completed).toBe(true);
        });
    });

    describe('Recurring Tasks', () => {
        it('should create a daily recurring task', () => {
            const id = taskManager.createRecurringTask('Daily Task', 'Occurs daily', 'daily');

            const task = taskManager.getTaskById(id);
            expect(task.title).toBe('Daily Task');
            expect(task.type).toBe('recurring');
            expect(task.frequency).toBe('daily');
            expect(task.nextOccurrence).toBeInstanceOf(Date);
        });

        it('should create weekly and monthly recurring tasks', () => {
            const weeklyId = taskManager.createRecurringTask('Weekly Task', 'Occurs weekly', 'weekly');
            const monthlyId = taskManager.createRecurringTask('Monthly Task', 'Occurs monthly', 'monthly');

            const weeklyTask = taskManager.getTaskById(weeklyId);
            const monthlyTask = taskManager.getTaskById(monthlyId);

            expect(weeklyTask.frequency).toBe('weekly');
            expect(monthlyTask.frequency).toBe('monthly');
        });

        it('should handle completion of a recurring task by scheduling next occurrence', () => {
            const id = taskManager.createRecurringTask('Recurring Task to Complete', 'Test Description', 'daily');
            const originalTask = taskManager.getTaskById(id);
            const originalNextDate = originalTask.nextOccurrence.getTime();

            // Wait a moment to ensure date calculations are distinct
            setTimeout(() => {
                const result = taskManager.completeTask(id);
                const updatedTask = taskManager.getTaskById(id);

                expect(result.success).toBe(true);
                expect(result.message).toContain('Next occurrence:');
                expect(updatedTask.completed).toBe(true);
                expect(updatedTask.nextOccurrence.getTime()).toBeGreaterThan(originalNextDate);
            }, 10);
        });
    });

    describe('Task Retrieval', () => {
        it('should get a task by ID', () => {
            const id = taskManager.createRegularTask('Get by ID Test');

            const task = taskManager.getTaskById(id);
            expect(task).toBeDefined();
            expect(task.id).toBe(id);
        });

        it('should get all tasks', () => {
            taskManager.createRegularTask('Task 1');
            taskManager.createRegularTask('Task 2');
            taskManager.createRecurringTask('Task 3', '', 'daily');

            const allTasks = taskManager.getAllTasks();
            expect(allTasks.length).toBe(3);
        });

        it('should get tasks by type', () => {
            taskManager.createRegularTask('Regular 1');
            taskManager.createRegularTask('Regular 2');
            taskManager.createRecurringTask('Recurring 1', '', 'daily');
            taskManager.createRecurringTask('Recurring 2', '', 'weekly');

            const recurringTasks = taskManager.getTasksByType(task => task.type === 'recurring');
            expect(recurringTasks.length).toBe(2);
            expect(recurringTasks[0].title).toBe('Recurring 1');
            expect(recurringTasks[1].title).toBe('Recurring 2');
        });
    });
});