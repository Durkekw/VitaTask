package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"strconv"
	"time"
)

func CreateTaskHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request struct {
			TaskTitle  string `json:"taskTitle"`
			TaskDesc   string `json:"taskDesc"`
			TaskStatus string `json:"taskStatus"`
			Deadline   string `json:"deadline"`
			TeamID     int    `json:"teamID"`
			UserID     int    `json:"userID"`
		}

		if err := c.BodyParser(&request); err != nil {
			fmt.Printf("Ошибка парсинга данных: %v\n", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request data"})
		}

		fmt.Printf("Полученные данные: %+v\n", request)

		// Проверка обязательных полей
		if request.TaskTitle == "" || request.TaskDesc == "" || request.Deadline == "" || request.TeamID == 0 || request.UserID == 0 {
			log.Printf("Отсутствуют обязательные поля: %+v", request)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Отсутствуют обязательные поля",
			})
		}

		// Парсинг даты
		var parsedDate time.Time
		var err error

		// Попытка распарсить дату как DD.MM.YYYY
		parsedDate, err = time.Parse("02.01.2006", request.Deadline)
		if err != nil {
			// Если не удалось, попробуем распарсить как MM.DD.YYYY
			parsedDate, err = time.Parse("01.02.2006", request.Deadline)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format. Use DD.MM.YYYY or MM.DD.YYYY"})
			}
		}

		// Преобразуем дату в формат YYYY-MM-DD
		formattedDeadline := parsedDate.Format("2006-01-02")
		fmt.Printf("Преобразованная дата: %s\n", formattedDeadline) // Логируем преобразованную дату

		// Начинаем транзакцию
		tx, err := db.Begin()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer tx.Rollback()

		// Создаем задачу
		var taskId int
		createdAt := time.Now().Format("2006-01-02") // Форматируем дату создания
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."task" (task_title, task_description, task_status, deadline, created_at, team_id, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING task_id`,
			request.TaskTitle, request.TaskDesc, request.TaskStatus, formattedDeadline, createdAt, request.TeamID, request.UserID,
		).Scan(&taskId)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Добавляем запись в таблицу user_task
		_, err = tx.Exec(
			`INSERT INTO "ViTask"."user_task" (user_id, task_id, team_id) 
             VALUES ($1, $2, $3)`,
			request.UserID, taskId, request.TeamID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Фиксируем транзакцию
		err = tx.Commit()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"taskId": taskId})
	}
}

func GetTasksHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		teamID := c.Params("team_id")
		log.Printf("Fetching tasks for team ID: %s", teamID) // Логируем team_id

		rows, err := db.Query(`
            SELECT 
                t.task_id, 
                t.task_title, 
                t.task_description, 
                t.task_status, 
                t.deadline, 
                t.created_at, 
                t.team_id, 
                t.user_id,
                u.name,
                u.surname
            FROM "ViTask"."task" t
            INNER JOIN "ViTask"."user_task" ut ON t.task_id = ut.task_id
            INNER JOIN "ViTask"."user" u ON t.user_id = u.user_id
            WHERE ut.team_id = $1
        `, teamID)
		if err != nil {
			log.Printf("Error executing query: %v", err) // Логируем ошибку
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		defer rows.Close()

		var tasks []models.Task
		for rows.Next() {
			var task models.Task
			var deadline, createdAt time.Time

			err := rows.Scan(
				&task.TaskID,
				&task.TaskTitle,
				&task.TaskDesc,
				&task.TaskStatus,
				&deadline,
				&createdAt,
				&task.TeamId,
				&task.UserID,
				&task.Name,
				&task.Surname,
			)
			if err != nil {
				log.Printf("Error scanning row: %v", err) // Логируем ошибку
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": err.Error(),
				})
			}

			task.Deadline = deadline.Format("2006-01-02")
			task.CreatedAt = createdAt.Format("2006-01-02")

			tasks = append(tasks, task)
		}

		if err = rows.Err(); err != nil {
			log.Printf("Error after scanning rows: %v", err) // Логируем ошибку
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		log.Printf("Tasks fetched: %+v", tasks) // Логируем задачи
		return c.Status(fiber.StatusOK).JSON(tasks)
	}
}
func GetTaskByIDHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		taskID, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid task ID",
			})
		}

		var task models.Task
		row := db.QueryRow(
			`SELECT task_id, task_title, task_description, task_status, deadline, created_at, team_id, user_id 
			 FROM "ViTask"."task" 
			 WHERE task_id = $1`,
			taskID,
		)
		err = row.Scan(
			&task.TaskID, &task.TaskTitle, &task.TaskDesc, &task.TaskStatus,
			&task.Deadline, &task.CreatedAt, &task.TeamId, &task.UserID,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Task not found",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(task)
	}
}

func AddTaskCommentHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request struct {
			TaskCommentContent string `json:"task_comment_content"`
			TaskID             int    `json:"task_id"`
			UserID             int    `json:"user_id"`
		}
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if request.TaskID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Task ID is required"})
		}
		if request.UserID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
		}
		if request.TaskCommentContent == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Comment content is required"})
		}

		// Создаем комментарий
		comment := models.TaskComment{
			TaskCommentContent: request.TaskCommentContent,
			TaskID:             request.TaskID,
			UserID:             request.UserID,
		}

		err := database.AddTaskComment(db, comment)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Comment added successfully"})
	}
}

func GetTaskCommentsHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Получаем ID задачи из параметров запроса
		taskID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
		}

		// Получаем комментарии из базы данных
		comments, err := database.GetTaskComments(db, taskID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Возвращаем комментарии в формате JSON
		return c.Status(fiber.StatusOK).JSON(comments)
	}
}

func UpdateTaskHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		taskID, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
		}

		var request struct {
			TaskTitle       string `json:"taskTitle"`
			TaskDescription string `json:"taskDescription"`
			TaskStatus      string `json:"taskStatus"`
			Deadline        string `json:"deadline"`
			UserID          int    `json:"userID"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Обновляем задачу в базе данных
		err = database.UpdateTask(db, taskID, request.TaskTitle, request.TaskDescription, request.TaskStatus, request.Deadline, request.UserID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Task updated successfully"})
	}
}

func DeleteTaskHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Получаем ID задачи из параметров URL
		taskID, err := c.ParamsInt("id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
		}

		// Проверяем, существует ли задача с таким ID
		var exists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "ViTask"."task" WHERE task_id = $1)`, taskID).Scan(&exists)
		if err != nil || !exists {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Task not found"})
		}

		// Начинаем транзакцию
		tx, err := db.Begin()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer tx.Rollback()

		// Удаляем связанные записи из таблицы user_task
		_, err = tx.Exec(`DELETE FROM "ViTask"."user_task" WHERE task_id = $1`, taskID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete related user_task records"})
		}

		// Удаляем связанные комментарии из таблицы task_comment
		_, err = tx.Exec(`DELETE FROM "ViTask"."task_comment" WHERE task_id = $1`, taskID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete related task comments"})
		}

		// Удаляем саму задачу
		_, err = tx.Exec(`DELETE FROM "ViTask"."task" WHERE task_id = $1`, taskID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete task"})
		}

		// Фиксируем транзакцию
		err = tx.Commit()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Task deleted successfully"})
	}
}
