package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"strconv"
	"time"
)

func CreateTaskHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request struct {
			TaskTitle  string `json:"task_title"`
			TaskDesc   string `json:"task_description"`
			TaskStatus string `json:"task_status"`
			Deadline   string `json:"deadline"`
			TeamId     int    `json:"team_id"`
			UserID     int    `json:"user_id"` // ID выбранного пользователя
		}
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if request.UserID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
		}
		if request.TeamId == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Team ID is required"})
		}

		tx, err := db.Begin()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer tx.Rollback()

		var taskId int
		createdAt := time.Now().Format("02.01.2006") // Форматируем дату
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."task" (task_title, task_description, task_status, deadline, created_at, team_id, user_id) 
			 VALUES ($1, $2, $3, $4, $5, $6, $7) 
			 RETURNING task_id`,
			request.TaskTitle, request.TaskDesc, request.TaskStatus, request.Deadline, createdAt, request.TeamId, request.UserID,
		).Scan(&taskId)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		_, err = tx.Exec(
			`INSERT INTO "ViTask"."user_task" (user_id, task_id, team_id) 
			 VALUES ($1, $2, $3)`,
			request.UserID, taskId, request.TeamId,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		err = tx.Commit()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"taskId": taskId})
	}
}

func GetTasksHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tasks, err := database.GetTasks(db)
		if err != nil {
			// В случае ошибки возвращаем статус 500 и сообщение об ошибке
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

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
