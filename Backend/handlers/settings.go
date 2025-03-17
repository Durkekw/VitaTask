package handlers

import (
	"Backend/models"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func SettingsHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Получаем user_id из параметров запроса
		userID, err := c.ParamsInt("user_id")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user_id"})
		}

		// Парсим тело запроса
		var updatedUser models.User
		if err := c.BodyParser(&updatedUser); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Получаем текущего пользователя из базы данных
		var currentUser models.User
		queryGetCurrentUser := `
		    SELECT user_id, email, name, surname, password
		    FROM "ViTask"."user"
		    WHERE user_id = $1
		`
		err = db.QueryRow(queryGetCurrentUser, userID).Scan(
			&currentUser.UserID, &currentUser.Email, &currentUser.Name, &currentUser.Surname,
			&currentUser.Password,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user"})
		}

		//Проверяем, совпадает ли старый пароль
		if updatedUser.Password != "" { // Если новый пароль предоставлен
			err = bcrypt.CompareHashAndPassword([]byte(currentUser.Password), []byte(updatedUser.Password))
			if err == nil {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Passwords are the same"})
			}
		}

		// Хэшируем новый пароль, если он предоставлен
		if updatedUser.Password != "" {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(updatedUser.Password), bcrypt.DefaultCost)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
			}
			updatedUser.Password = string(hashedPassword)
		} else {
			// Если новый пароль не предоставлен, сохраняем старый
			updatedUser.Password = currentUser.Password
		}

		if updatedUser.Name == "" {
			updatedUser.Name = currentUser.Name
		}
		if updatedUser.Surname == "" {
			updatedUser.Surname = currentUser.Surname
		}
		if updatedUser.Email == "" {
			updatedUser.Email = currentUser.Email
		}

		queryUpdateUser := `
            UPDATE "ViTask"."user"
            SET email = COALESCE($1, email),
                name = COALESCE($2, name),
                surname = COALESCE($3, surname),
                password = COALESCE($4, password)
            WHERE user_id = $5
            RETURNING user_id, email, name, surname, password
        `
		var user models.User
		err = db.QueryRow(
			queryUpdateUser,
			updatedUser.Email, updatedUser.Name, updatedUser.Surname, updatedUser.Password, userID,
		).Scan(
			&user.UserID, &user.Email, &user.Name, &user.Surname, &user.Password,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
		}

		return c.Status(fiber.StatusOK).JSON(user)
	}
}
