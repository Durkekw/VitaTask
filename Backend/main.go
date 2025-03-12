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
	app.Get("/team/:teamId/members", handlers.GetTeamMembersHandler(db))
	app.Get("/unteamed-users", handlers.GetUnteamedUsersHandler(db))

	log.Println("Server started on :8080")
	log.Fatal(app.Listen(":8080"))
}
