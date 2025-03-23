package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"strconv"
)

func RegisterHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var user models.User
		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		// Проверяем, существует ли пользователь с таким email
		existingUser, err := database.GetUserByEmail(db, user.Email)
		if err != nil && err != sql.ErrNoRows {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
		}
		if existingUser != nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Email already exists"})
		}

		// Хэшируем пароль
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
		}
		user.Password = string(hashedPassword)

		// Вставляем пользователя в базу данных и получаем его ID
		var userID int
		err = db.QueryRow(`
            INSERT INTO "ViTask"."user" (email, password, name, surname)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id`,
			user.Email, user.Password, user.Name, user.Surname,
		).Scan(&userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		// Получаем данные зарегистрированного пользователя
		registeredUser := models.User{
			UserID:  userID,
			Email:   user.Email,
			Name:    user.Name,
			Surname: user.Surname,
			TeamID:  user.TeamID, // По умолчанию team_id = 0 (NULL)
		}

		// Возвращаем данные пользователя
		return c.Status(fiber.StatusCreated).JSON(registeredUser)
	}
}

func LoginHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var user models.User
		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Получаем пользователя по email
		storedUser, err := database.GetUserByEmail(db, user.Email)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found"})
		}

		// Проверяем пароль
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid password"})
		}

		// Если у пользователя есть команда, получаем её
		if storedUser.TeamID.Valid {
			team, err := database.GetTeamByID(db, int(storedUser.TeamID.Int64))
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get team"})
			}
			storedUser.Team = team
		}

		// Возвращаем данные пользователя
		return c.Status(fiber.StatusOK).JSON(storedUser)
	}
}

func GetUserByIDHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.Atoi(c.Params("userId"))
		if err != nil || userID <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		user, err := database.GetUserByID(db, userID)
		if err != nil {
			if err == sql.ErrNoRows {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(user)
	}
}
