package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"log"
	"strconv"
)

func CreateTeamHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request struct {
			TeamName string `json:"teamName"`
			UserID   int    `json:"userId"`
		}
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		if request.UserID == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
		}

		// Начинаем транзакцию
		tx, err := db.Begin()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer tx.Rollback()

		// Создаем команду
		var teamID int
		err = tx.QueryRow(
			`INSERT INTO "ViTask"."team" (team_name, role_id) VALUES ($1, $2) RETURNING team_id`,
			request.TeamName, 1, // role_id = 1 (Менеджер)
		).Scan(&teamID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Обновляем роль пользователя на "Manager" (role_id = 1)
		_, err = tx.Exec(
			`UPDATE "ViTask"."user" SET role_id = 1 WHERE user_id = $1`,
			request.UserID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Обновляем team_id пользователя
		_, err = tx.Exec(
			`UPDATE "ViTask"."user" SET team_id = $1 WHERE user_id = $2`,
			teamID, request.UserID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Добавляем пользователя в команду через таблицу user_team
		_, err = tx.Exec(
			`INSERT INTO "ViTask"."user_team" (user_id, team_id) VALUES ($1, $2)`,
			request.UserID, teamID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Завершаем транзакцию
		err = tx.Commit()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"teamId": teamID, "roleId": 1, "teamName": request.TeamName})
	}
}

func AddUserToTeamHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request struct {
			UserID int `json:"user_id"`
			TeamID int `json:"team_id"`
		}
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Обновляем team_id пользователя
		_, err := db.Exec(`UPDATE "ViTask"."user" SET team_id = $1 WHERE user_id = $2`, request.TeamID, request.UserID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update team_id"})
		}

		_, err = db.Exec(
			`UPDATE "ViTask"."user" SET role_id = 2 WHERE user_id = $1`,
			request.UserID,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Добавляем пользователя в команду
		err = database.AddUserToTeam(db, request.UserID, request.TeamID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add user to team"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "User added to team successfully"})
	}
}

func DeleteUserFromTeamHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Получаем user_id и team_id из параметров URL
		userID, err := c.ParamsInt("user_id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user_id"})
		}

		teamID, err := c.ParamsInt("team_id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid team_id"})
		}

		var exists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "ViTask"."user" WHERE user_id = $1)`, userID).Scan(&exists)
		if err != nil || !exists {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "ViTask"."team" WHERE team_id = $1)`, teamID).Scan(&exists)
		if err != nil || !exists {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Team not found"})
		}

		log.Printf("Deleting user %d from team %d", userID, teamID)

		_, err = db.Exec(`UPDATE "ViTask"."user" SET team_id = NULL, role_id = NULL WHERE user_id = $1`, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
		}

		err = database.DeleteFromTeam(db, userID, teamID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user from team"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "User deleted from team successfully"})
	}
}

func GetTeamMembersHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		teamID, err := strconv.Atoi(c.Params("teamId"))
		if err != nil || teamID <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid teamId"})
		}

		log.Println("Fetching team members for team ID:", teamID)

		rows, err := db.Query(`
            SELECT u.user_id, u.name, u.surname, u.email, u.role_id, u.team_id 
            FROM "ViTask"."user" u
            JOIN "ViTask"."user_team" ut ON u.user_id = ut.user_id
            WHERE ut.team_id = $1`, teamID)
		if err != nil {
			log.Println("Error fetching team members:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer rows.Close()

		var members []models.User
		for rows.Next() {
			var member models.User
			err := rows.Scan(&member.UserID, &member.Name, &member.Surname, &member.Email, &member.RoleID, &member.TeamID)
			if err != nil {
				log.Println("Error scanning row:", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			members = append(members, member)
		}

		if len(members) == 0 {
			log.Println("No members found for team ID:", teamID)
		} else {
			log.Println("Fetched team members:", members)
		}

		return c.Status(fiber.StatusOK).JSON(members)
	}
}

func GetUnteamedUsersHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rows, err := db.Query(`
            SELECT user_id, name, surname, email 
            FROM "ViTask"."user" 
            WHERE (team_id IS NULL OR team_id = 0)
        `)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		defer rows.Close()

		var users []models.User
		for rows.Next() {
			var user models.User
			err := rows.Scan(&user.UserID, &user.Name, &user.Surname, &user.Email)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
			}
			users = append(users, user)
		}

		return c.Status(fiber.StatusOK).JSON(users)
	}
}
