package main

import (
	"Backend/database"
	"Backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
)

func main() {
	db := database.ConnectDB()
	defer db.Close()

	app := fiber.New()

	// Настройка CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	// Регистрация маршрутов
	app.Post("/register", handlers.RegisterHandler(db))
	app.Post("/login", handlers.LoginHandler(db))
	app.Post("/create-team", handlers.CreateTeamHandler(db))
	app.Post("/add-user-to-team", handlers.AddUserToTeamHandler(db))
	app.Delete("/delete-user-from-team/:user_id/:team_id", handlers.DeleteUserFromTeamHandler(db))
	app.Get("/team/:teamId/members", handlers.GetTeamMembersHandler(db))
	app.Get("/user/:userId", handlers.GetUserByIDHandler(db))
	app.Get("/unteamed-users", handlers.GetUnteamedUsersHandler(db))
	app.Post("/settings/:user_id", handlers.SettingsHandler(db))
	app.Post("/create-task", handlers.CreateTaskHandler(db))
	app.Get("/tasks/:team_id", handlers.GetTasksHandler(db))
	app.Post("/task-comment", handlers.AddTaskCommentHandler(db))
	app.Get("/task/:id/comments", handlers.GetTaskCommentsHandler(db))
	app.Put("/tasks/:id", handlers.UpdateTaskHandler(db))
	app.Delete("/tasks/:id", handlers.DeleteTaskHandler(db))
	app.Post("/send-message", handlers.SendMessageHandler(db))
	app.Get("/messages/:chat_id", handlers.GetMessagesHandler(db))
	app.Get("/users-with-chats/:user_id", handlers.GetUsersWithChatsHandler(db))
	app.Get("/messenger/user/:id", handlers.GetChatUserByIDHandler(db))

	log.Println("Server started on :8080")
	log.Fatal(app.Listen(":8080"))
}
