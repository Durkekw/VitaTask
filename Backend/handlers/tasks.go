package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
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
			UserID     int    `json:"user_id"`
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

		ttime := time.Now()
		tt := ttime.Format("02.01.2006")

		var taskId int
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."task" (task_title, task_description, task_status, deadline, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING task_id`,
			request.TaskTitle, request.TaskDesc, request.TaskStatus, request.Deadline, tt,
		).Scan(&taskId)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		_, err = tx.Exec(
			`INSERT INTO "ViTask"."user_task" (user_id, task_id, team_id) VALUES ($1, $2, $3)`,
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
