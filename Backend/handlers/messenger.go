package handlers

import (
	"Backend/database"
	"Backend/models"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"log"
	"strconv"
)

// SendMessageHandler обрабатывает отправку сообщения.
func SendMessageHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Структура запроса
		var request struct {
			UserID     int    `json:"user_id"`     // ID отправителя
			ReceiverID int    `json:"receiver_id"` // ID получателя
			Content    string `json:"content"`
		}

		// Парсим тело запроса
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Проверяем, существует ли уже чат между пользователями
		chat, err := database.GetChatBetweenUsers(db, request.UserID, request.ReceiverID)
		if err != nil && err != sql.ErrNoRows {
			log.Printf("Error checking existing chat: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to check existing chat"})
		}

		var chatID int
		if chat == nil {
			log.Printf("No chat found between users %d and %d, creating a new chat", request.UserID, request.ReceiverID)

			// Создаем новый чат
			chatID, err = database.CreateChat(db, request.UserID, "")
			if err != nil {
				log.Printf("Failed to create chat: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create chat"})
			}

			// Добавляем отправителя и получателя в чат
			if err := database.AddUserToChat(db, chatID, request.UserID); err != nil {
				log.Printf("Failed to add sender to chat: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add sender to chat"})
			}

			if err := database.AddUserToChat(db, chatID, request.ReceiverID); err != nil {
				log.Printf("Failed to add receiver to chat: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to add receiver to chat"})
			}
		} else {
			log.Printf("Existing chat found: %+v", chat)
			chatID = chat.ChatID
		}

		// Отправляем сообщение
		messageID, createdAt, err := database.AddMessage(db, request.UserID, chatID, request.Content)
		if err != nil {
			log.Printf("Failed to send message: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send message"})
		}

		// Формируем ответ с данными о сообщении
		response := fiber.Map{
			"message_id": messageID,
			"user_id":    request.UserID,
			"chat_id":    chatID,
			"content":    request.Content,
			"created_at": createdAt.Format("15:04"), // Форматируем время в ISO 8601
			"status":     "Message sent successfully",
		}

		return c.Status(fiber.StatusCreated).JSON(response)
	}
}

// GetMessagesHandler возвращает сообщения из чата.
func GetMessagesHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Получаем chat_id из параметров URL
		chatID, err := strconv.Atoi(c.Params("chat_id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid chat ID"})
		}

		// Загружаем сообщения из базы данных
		messages, err := database.GetMessagesByChatID(db, chatID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch messages"})
		}

		// Возвращаем сообщения в формате JSON
		return c.Status(fiber.StatusOK).JSON(messages)
	}
}

func GetUsersWithChatsHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		currentUserID, err := strconv.Atoi(c.Params("user_id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		users, err := database.GetUsersWithChats(db, currentUserID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch users with chats"})
		}

		// Если users пустой, возвращаем пустой массив
		if users == nil {
			users = []models.UserWithChat{}
		}

		return c.Status(fiber.StatusOK).JSON(users)
	}
}

func GetChatUserByIDHandler(db *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}

		user, err := database.GetUserByID(db, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user"})
		}

		if user == nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}

		return c.Status(fiber.StatusOK).JSON(user)
	}
}
